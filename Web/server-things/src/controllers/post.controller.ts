import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const Prisma = new PrismaClient()

export class PostController {
    async MakePost(req: Request, res: Response) {
        const { title, content, genre, authorId } = req.body

        const findAuthor = await Prisma.account.findMany({
            where: {
                id: authorId,
                posts: {
                    
                }
            }
        })
        const MakingPost = await Prisma.post.create({
            data: {
                title,
                content,
                genre,
                authorId
            }
        })
    }
}