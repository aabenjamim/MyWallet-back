import dayjs from 'dayjs'
import { db } from '../database/database.connection.js'

export async function postTransacao(req, res) {

    const {tipo, valor, descricao} = req.body
  
    try{

        const sessao = res.locals.sessao
       
        db.collection("transacoes").insertOne({
            idUsuario: sessao.idUsuario,
            valor: valor,
            descricao: descricao,
            data: dayjs().format('DD/MM'),
            tipo: tipo
        }).then(()=>{
            res.send('OK!')
        })
          .catch(()=>res.status(400).send('Não foi possível inserir a entrada'))

    } catch(err){
        return res.status(500).send(err.message)
    }
}

export async function getHome(req, res){

    try {
        const sessao = res.locals.sessao
        const idUsuario = sessao.idUsuario

        const transacoes = await db.collection("transacoes").find({ idUsuario })
        .sort({ _id: -1 }).toArray()

        res.status(200).send(transacoes)

    } catch (err){
        res.status(500).send(err.message)
    }
}