import { Router } from 'express'
import { getHome, postTransacao } from '../controllers/transacao.controller.js'

const transacaoRouter = Router()

transacaoRouter.post('/nova-transacao/:tipo', postTransacao)

transacaoRouter.get('/home', getHome)

export default transacaoRouter