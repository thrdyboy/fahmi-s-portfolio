import express, {
    json,
    urlencoded,
    Express,
    Request,
    Response,
    NextFunction
} from 'express'
import cors from 'cors'
import { port } from './config'
import { AccRouter } from './routers/account.router'
import { PostRouter } from './routers/post.router'
import path from 'path'

const corsConfig = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

export default class App {
    private app: Express

    constructor() {
        this.app = express()
        this.configure()
        this.routes()
        this.HandleError()
    }

    private configure(): void {
        this.app.use(cors(corsConfig))
        this.app.use(json())
        this.app.use(urlencoded({ extended: true }))
        this.app.use('/images', express.static(path.join(__dirname, 'public/images')))
    }

    private HandleError(): void {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            if (req.path.includes('/api/')) {
                res.status(404).send('Not Found !')
            } else {
                next()
            }
        })

        this.app.use(
            (err: Error, req: Request, res: Response, next: NextFunction) => {
                if (req.path.includes('/api/')) {
                    console.error('Error : ', err.stack);
                    res.status(500).send('Error !');
                } else {
                    next();
                }
            },
        )
    }

    private routes(): void {
        const AccountRouter = new AccRouter()
        const PostingRouter = new PostRouter()
        this.app.use('/api/account', AccountRouter.getRouter())
        this.app.use('/api/post', PostingRouter.getRouter())
    }

    public start(): void {
        this.app.listen(port, () => {
            console.log(`[API] local: http://localhost:${port}`)
        })
    }
}