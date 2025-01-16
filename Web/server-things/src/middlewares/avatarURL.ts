import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
    destination(req, file, callback) {
        const pathToUploads = path.join(__dirname, '/public/images')
        if (!fs.existsSync(pathToUploads)) {
            fs.mkdirSync(pathToUploads, { recursive: true })
        }
        callback(null, pathToUploads)
    },
    filename(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    },
})

const Upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        const FileTypes = /jpeg|jpg|png/
        const ExtName = FileTypes.test(path.extname(file.originalname).toLowerCase())
        const MimeType = FileTypes.test(file.mimetype)

        if (MimeType && ExtName) {
            callback(null, true)
        } else {
            callback(new Error("Only images are allowed"))
        }
    },
})

export default Upload