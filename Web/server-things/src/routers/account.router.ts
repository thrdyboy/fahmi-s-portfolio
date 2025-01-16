import { Router } from "express";
import { AccountController } from "../controllers/account.controller";
import { authenticateJWT, tokenVerifying } from "../middlewares/account.middleware";
import Upload from "../middlewares/avatarURL";

export class AccRouter {
    private router: Router
    private accController: AccountController

    constructor() {
        this.router = Router()
        this.accController = new AccountController()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post('/register', this.accController.CreateAccount)
        this.router.post('/verify/:token', tokenVerifying as any, this.accController.VerificationToken as any)
        this.router.post('/login', this.accController.SignInAcc)
        this.router.get('/profile', authenticateJWT as any, this.accController.getProfile as any)
        this.router.post('/create-profile', Upload.single('avatar'), this.accController.createProfile)
    }

    getRouter(): Router {
        return this.router
    }
}