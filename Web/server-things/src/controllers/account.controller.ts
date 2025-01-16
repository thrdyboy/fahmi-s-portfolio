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

    async getProfile(req: Request, res: Response) {
        const { id: accountId } = req.account!
        try {
            const Profile = await Prisma.profile.findUnique({
                where: { accountId },
                include: {
                    account: {
                        select: {
                            role: true
                        }
                    }
                }
            })
    
            if (!Profile) {
                return res.status(200).json({ message: 'Profile not Found, you should make the Profile', data: null })
            }

            return res.status(200).json({ 
                message: "Data was Fetched",
                data: Profile
            })
        } catch (error) {
            console.error("Error on fetch the Profile: ", error)
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    async createProfile(req: Request, res: Response): Promise<void> {
        const { id: accountId } = req.account!
        const { bio } = req.body
        const avatarUrl = req.file?.path

        try {
            const profileData = {
                bio,
                avatarUrl,
                account: {
                    connect: {
                        id: accountId
                    }
                }
            }

            const newProfile = await Prisma.profile.create({
                data: profileData,
                include: {
                    account: true
                }
            })

            res.status(201).json({
                message: "Profile Created Successfully",
                data: newProfile
            })

        } catch (error) {
            res.status(500).json({ message: "Error, Failed to make Profile" })
            console.error("Error: ", error)
        }
    }
}