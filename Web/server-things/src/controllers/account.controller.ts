import { PrismaClient, Role } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import { Request, Response } from "express";
import { EmailHelper } from "../helpers/nodemailers";
import jwt, { verify } from 'jsonwebtoken';

const Prisma = new PrismaClient()

export class AccountController {
    async CreateAccount(req: Request, res: Response): Promise<void> {
        const { name, email, username, password, role } = req.body
        if (!name || !email || !username || !password || !role) {
            res.status(400).json({ message: "All fields are required" })
            return
        }

        const validRoles: Role[] = ["author", "user"]
        if (!validRoles.includes(role as Role)) {
            res.status(400).json({ error: "Invalid role. Must be 'author' or 'user'" })
            return
        }

        try {
            const salt = await genSalt(10)
            const hashedPassword = await hash(password, salt)

            const newAccount = await Prisma.account.create({
                data: {
                    name,
                    email,
                    username,
                    password: hashedPassword,
                    role,
                }
            })

            const emailVerify = new EmailHelper()
            const sendingVerification = await emailVerify.SendingMailUser(newAccount.id, newAccount.email)

            res.status(201).json({
                message: "Account created successfully",
                data: {
                    id: newAccount.id,
                    name: newAccount.name,
                    email: newAccount.email,
                    username: newAccount.username,
                    role: newAccount.role,
                    token: sendingVerification
                },
            })
        } catch (error: any) {
            if (error.code === "P2002") {
                res.status(409).json({ message: "Email or username already exists" })
            } else {
                console.error("Error registering account: ", error)
                res.status(500).json({ error: "Internal server error" })
            }
        }
    }

    async VerificationToken(req: Request, res: Response): Promise<void> {
        try {
            const token = req.params.token

            if (!token) {
                res.status(400).send({ message: 'Token is missing' })
            }

            const decoded = verify(token, process.env.SECRET_JWT!) as { id: string; email: string }

            const user = await Prisma.account.findUnique({
                where: { id: decoded.id, email: decoded.email }
            })

            if (user?.isActive === true) {
                res.status(409).send({ message: 'User has Authenticated'})
            } else {
                await Prisma.account.update({
                    where: { id: user?.id },
                    data: { isActive: true }
                })

                res.status(200).json({
                    status: 'success',
                    message: 'Verification Successful',
                    data: user
                })
            }
        } catch (error) {
            res.status(500).send({ message: 'Error on Updating Verification'})
            console.error("Verification Failed: ", error)   
        }
    }


    async SignInAcc(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: "Username and password are required" });
            return;
        }

        try {
            const account = await Prisma.account.findUnique({
                where: { username },
            });

            if (!account || !account.isActive) {
                res.status(404).json({ error: "Invalid credentials or account is inactive" });
                return;
            }

            const passwordValid = await compare(password, account.password);
            if (!passwordValid) {
                res.status(401).json({ error: "Invalid password" });
                return;
            }

            const payload = { id: account.id, role: account.role };
            const token = jwt.sign(payload, process.env.SECRET_JWT!, { expiresIn: "1d" });

            res.status(200).json({
                message: "Login successful",
                data: {
                    id: account.id,
                    username: account.username,
                    role: account.role,
                    token,
                },
            });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    }

    async createProfile(req: Request, res: Response): Promise<void> {
        const { bio, avatarUrl, accountId } = req.body;

        try {
            const existingAccount = await Prisma.account.findFirst({
                where: { id: accountId },
            });

            if (!existingAccount) {
                res.status(404).json({ error: "Account not found" });
                return;
            }

            const profile = await Prisma.profile.create({
                data: {
                    bio,
                    avatarUrl,
                    account: { connect: { id: existingAccount.id } },
                },
            });

            res.status(201).json({
                message: "Profile created successfully",
                data: {
                    id: profile.id,
                    bio: profile.bio,
                    avatarUrl: profile.avatarUrl,
                    accountId: profile.accountId,
                },
            });
        } catch (error) {
            console.error("Error creating profile: ", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        const account = req.account;

        if (!account) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        try {
            if (account.role === "author") {
                const authorAccount = await Prisma.account.findFirst({
                    where: { id: account.id },
                    include: {
                        profile: true,
                        posts: true,
                    },
                });

                if (!authorAccount) {
                    res.status(404).json({ error: "Author account not found" });
                    return;
                }

                res.status(200).json({
                    id: authorAccount.id,
                    name: authorAccount.name,
                    email: authorAccount.email,
                    username: authorAccount.username,
                    role: authorAccount.role,
                    profile: authorAccount.profile,
                    posts: authorAccount.posts.map((post) => ({
                        id: post.id,
                        title: post.title,
                        content: post.content,
                    })),
                });
            } else if (account.role === "user") {
                const userAccount = await Prisma.account.findFirst({
                    where: { id: account.id },
                    include: {
                        profile: true,
                    },
                });

                if (!userAccount) {
                    res.status(404).json({ error: "User account not found" });
                    return;
                }

                res.status(200).json({
                    id: userAccount.id,
                    name: userAccount.name,
                    email: userAccount.email,
                    username: userAccount.username,
                    role: userAccount.role,
                    profile: userAccount.profile,
                });
            } else {
                res.status(403).json({ error: "Unrecognized role" });
            }
        } catch (error) {
            console.error("Error fetching profile: ", error);
            res.status(500).json({ error: "Internal server error" });
        } finally {
            await Prisma.$disconnect();
        }
    }
}