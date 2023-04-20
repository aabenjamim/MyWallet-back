import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import joi from 'joi'
import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'

// Criação do servidor
const app = express()

// Configurações
app.use(cors())
app.use(express.json())
dotenv.config()

// Conexão com o Banco de Dados
let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))

// Endpoints

const inserirSchema = joi.object({
    valor: joi.number().precision(2).required(),
    descricao: joi.string().required()
})

const tipoSchema = joi.object({
    tipo: joi.string().valid('entrada', 'saida')
})

const userCadastroSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required().min(3),
  })

const userLoginSchema = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().required(),
  })

app.post('/cadastro', async(req, res)=>{
    const {nome, email, senha}= req.body;

    const validacao = userCadastroSchema.validate(req.body, { abortEarly: false })
  
    if (validacao.error) {
      return res.status(422).send('Não foi possível validar os dados')
    }

    try {
        const usuario = await db.collection("usuarios").findOne({email}) 
            if (usuario) return res.status(409).send("E-mail já cadastrado")

        const senhaCripto = bcrypt.hashSync(senha, 10)
  
        await db.collection('usuarios').insertOne({ nome, email, senha: senhaCripto })
        res.status(201).send('Usuário cadastrado com sucesso!')

    } catch (err) {
      res.status(500).send(err.message)
    }
})

app.post('/', async(req, res)=>{
    const { email, senha } = req.body

    const validacao = userLoginSchema.validate(req.body, { abortEarly: false })
  
    if (validacao.error) {
      return res.status(422).send('Não foi possível validar os dados')
    }

    try{
        const user = await db.collection('usuarios').findOne({email});
            if(!user) return res.status(401).send("Email não cadastrado!")

        const senhaCorreta = bcrypt.compareSync(senha, user.senha)
            if(!senhaCorreta) return res.status(401).send("Senha incorreta!")

        res.sendStatus(200)

    }catch(err){
        res.status(500).send(err.message)
    }    
})

app.post('/nova-transacao/:tipo', (req, res)=>{
    const {tipo} = req.params
    const {valor, descricao} = req.body

    const validation = tipoSchema.validate(req.params)
        if(validation.error) return res.status(422).send('Rota não encontrada')
    
    try{
        const validacao = inserirSchema.validate({valor, descricao})
            if(validacao.error) return res.status(422).send('Valor ou descrição inválidos')
        
        db.collection(tipo).insertOne({
            valor: valor,
            descricao: descricao,
            data: dayjs().format('DD/MM')
        }).then(()=>res.send('OK!'))
          .catch(()=>res.status(400).send('Não foi possível inserir a entrada'))

    } catch(err){
        return res.status(500).send(err.message)
    }
})

app.get('/nova-transacao/:tipo', (req, res)=>{
    const {tipo} = req.params

    const validation = tipoSchema.validate(req.params)
    if(validation.error) return res.status(422).send('Rota não encontrada')

    db.collection(tipo).find().toArray()
        .then((transacoes)=> res.status(200).send(transacoes))
        .catch(()=>res.status(500).send('Não foi possível pegar as transações'))
    
})

app.get('/cadastro', async(req, res)=>{
   const user = await db.collection("usuarios").find().toArray()
    if(!user) return res.status(500).send('erro')
    res.status(200).send(user)

})


// Deixa o app escutando, à espera de requisições
const PORT = 5000
app.listen(PORT, ()=>console.log(`O servidor está rodando na porta ${PORT}`))
