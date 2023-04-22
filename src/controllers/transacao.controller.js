import dayjs from 'dayjs'
import { inserirSchema, tipoSchema } from "../schemas/transacao.schemas.js"
import { db } from '../database/database.connection.js'

export async function postTransacao(req, res) {

    const { authorization } = req.headers

    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.status(401).send("Token inexistente")

    const {tipo} = req.params
    const {valor, descricao} = req.body

    const validation = tipoSchema.validate({tipo})
        if(validation.error) return res.status(422).send('Rota não encontrada')
    
    try{

        const sessao = await db.collection("sessoes").findOne({ token })
        if (!sessao) return res.status(401).send("Token inválido")

        const validacao = inserirSchema.validate({valor, descricao})
            if(validacao.error) return res.status(422).send('Valor ou descrição inválidos')
        
        db.collection("transacoes").insertOne({
            idUsuario: sessao.idUsuario,
            valor: valor,
            descricao: descricao,
            data: dayjs().format('DD/MM'),
            tipo: tipo
        }).then(()=>{
            res.send('OK!')
            console.log(tipo)})
          .catch(()=>res.status(400).send('Não foi possível inserir a entrada'))

    } catch(err){
        return res.status(500).send(err.message)
    }
}

export async function getHome(req, res){

    const { authorization } = req.headers

    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.status(401).send("Token inexistente")

    try {
        const sessao = await db.collection("sessoes").findOne({ token })
        if (!sessao) return res.status(401).send("Token inválido")

        console.log(sessao)
        const idUsuario = sessao.idUsuario
        console.log("idUsuario:", idUsuario)

        const transacoes = await db.collection("transacoes").find({ idUsuario }).sort({ _id: -1 }).toArray()

        console.log(transacoes)

        res.status(200).send(transacoes)
    } catch (err){
        res.status(500).send(err.message)
    }
}