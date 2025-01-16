import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { PrismaClient, Role } from '@prisma/client'
import { accList } from '../custom'

const Prisma = new PrismaClient()

export const tokenVerifying = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) throw new Error("Token not Found")

        const Verif = jwt.verify(token, process.env.SECRET_JWT!) as { id: string, email: string }
        req.user = Verif

        next()
    } catch (error: any) {
        console.error("Token verification error:", error.message)
        res.status(401).send({
            message: 'Token not found or invalid',
        })
    }
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (!token) throw new Error('Token is missing')
        console.log("Received Token: ", token)
        
        const data = jwt.verify(token, process.env.SECRET_JWT as string) as accList
        const Account = await Prisma.account.findUnique({
            where: { id: data.id, role: data.role }
        })
        if (!Account) {
            return res.status(403).send({ message: 'Account not Found' })
        }
        req.account = Account as accList
        next()
    } catch (error) {
        console.error("Error on the Server: ", error)
        return res.status(500).send({ error: "Error on the Server" })
    }
}