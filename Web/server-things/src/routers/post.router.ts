import { Router } from "express";
import { PostController } from "../controllers/post.controller";

export class PostRouter {
    private router: Router
    private postsController: PostController

    constructor() {
        this.router = Router()
        this.postsController = new PostController()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/motherfucker')
    }
}