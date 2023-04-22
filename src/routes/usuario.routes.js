import { Router } from 'express'
import { postCadastro, postLogin } from '../controllers/usuario.controller.js'

const usuarioRouter = Router()

usuarioRouter.post('/cadastro', postCadastro)

usuarioRouter.post('/', postLogin)

export default usuarioRouter