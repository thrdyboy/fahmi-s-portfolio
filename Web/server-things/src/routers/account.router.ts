import { Router } from "express";
import { AccountController } from "../controllers/account.controller";
import { AuthenticateJWT, tokenVerifying } from "../middlewares/account.middleware";

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
        this.router.get('/profile', AuthenticateJWT as any, this.accController.getProfile)
        this.router.post('/profile', AuthenticateJWT as any, this.accController.createProfile)
    }

    getRouter(): Router {
        return this.router
    }
}