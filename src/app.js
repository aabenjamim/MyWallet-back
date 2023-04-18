import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import joi from 'joi'
import dayjs from 'dayjs'

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



//rota /

//rota /cadastro

//rota /home

//rota /nova-entrada

const inserirSchema = joi.object({
    valor: joi.number().precision(2).required(),
    descricao: joi.string().required()
})

const tipoSchema = joi.object({
    tipo: joi.string().valid('entrada', 'saida')
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


// Deixa o app escutando, à espera de requisições
const PORT = 5000
app.listen(PORT, ()=>console.log(`O servidor está rodando na porta ${PORT}`))
