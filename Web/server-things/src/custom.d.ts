import { Role } from "@prisma/client"

type accList = {
    id: string;
    role: Role;
}

type User = {
    id: string;
    email: string;
}


declare global {
    namespace Express {
        interface Request {
            account?: accList
            user?: User
            file?: Express.Multer.File
            files?: Express.Multer.File[]
        }
    }
}