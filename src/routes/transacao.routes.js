import { Router } from 'express'
import { getHome, postTransacao } from '../controllers/transacao.controller.js'
import { validate } from '../middlewares/validateSchema.middleware.js'
import { inserirSchema } from '../schemas/transacao.schemas.js'
import { autenticacao } from '../middlewares/auth.middleware.js'

const transacaoRouter = Router()

transacaoRouter.use(autenticacao)

transacaoRouter.post('/nova-transacao/:tipo', validate(inserirSchema), postTransacao)

transacaoRouter.get('/home', getHome)

export default transacaoRouter