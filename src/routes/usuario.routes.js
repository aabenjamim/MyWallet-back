import { Router } from 'express'
import { postCadastro, postLogin } from '../controllers/usuario.controller.js'
import { validate } from '../middlewares/validateSchema.middleware.js'
import { userCadastroSchema, userLoginSchema } from "../schemas/usuario.schemas.js"


const usuarioRouter = Router()

usuarioRouter.post('/cadastro', validate(userCadastroSchema) ,postCadastro)

usuarioRouter.post('/', validate(userLoginSchema) ,postLogin)

export default usuarioRouter