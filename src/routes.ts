import { Router } from 'express'
import multer from 'multer'
import { BoletoController } from './controllers/BoletoController'


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const uploadStorage = multer({ storage: storage })

const multerConfig = multer()

const router = Router()

const boletoController = new BoletoController()

//atividade 1 e 2
router.post("/boletos", multerConfig.single("file"), boletoController.create)

// atividade 3
router.post("/importPdf", uploadStorage.single("file"), boletoController.importPdf)

// atividade 4 e 5
router.get("/boletos", boletoController.getBoletos)

export { router }
