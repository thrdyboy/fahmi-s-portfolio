import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'
import Handlebars from 'handlebars'
import { sign } from 'jsonwebtoken'

export class EmailHelper {
    private transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
    }

    async SendingMailUser(userId: string, userEmail: string) {
        try {
            const payload = { id: userId, email: userEmail }
            const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1h' })

            const templatePath = path.join(__dirname, "../templates/verification.hbs")
            const convertPath = fs.readFileSync(templatePath, 'utf-8')
            const compiledPath = Handlebars.compile(convertPath)

            const html = compiledPath({
                link: `http://localhost:3000/verify/${token}`
            })

            await this.transporter.sendMail({
                from: process.env.MAIL_USER,
                to: userEmail,
                subject: 'Email Verification',
                html: html
            })

        } catch (error) {
            throw new Error('Failed to send the Mail')
        }
    }
}