import jwt, { verify } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { accList } from '../custom'

const Prisma = new PrismaClient()

export async function AuthenticateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token is required.' })
    }
    
    const secKey = process.env.SECRET_JWT as string
    if (!secKey) {
        console.error('JWT secret key is missing in environment variables.')
        return res.status(500).json({ error: 'Server configuration error' })
    }

    try {
        const decoded = jwt.verify(token, secKey) as accList
        const account = await Prisma.account.findUnique({
            where: { id: decoded.id, role: decoded.role }
        })

        if (!account || !account.isActive) {
            return res.status(401).json({ error: 'Invalid credentials or account inactive.' })
        }

        req.account = {
            id: account.id,
            role: account.role
        }

        next()
    } catch (error) {
        res.status(500).send({message: 'error'})
        console.error("Error: ", error)
    }
}


export const tokenVerifying = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) throw new Error("Token not Found")
        
        const Verif = verify(token, process.env.SECRET_JWT!) as { id: string, email: string }
        req.user = Verif

        next();
    } catch (error: any) {
        console.error("Token verification error:", error.message)
        res.status(401).send({
            message: 'Token not found or invalid',
        });
    }
};
