import { Router } from "express"
import usuarioRouter from "./usuario.routes.js"
import transacaoRouter from "./transacao.routes.js"

const router = Router()
router.use(usuarioRouter)
router.use(transacaoRouter)

export default router