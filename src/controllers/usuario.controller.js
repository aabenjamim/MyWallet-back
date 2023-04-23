import { db } from '../database/database.connection.js'
import bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'


export async function postCadastro(req, res){
    const {nome, email, senha}= req.body

    try {
        const usuario = await db.collection("usuarios").findOne({email}) 
            if (usuario) return res.status(409).send("E-mail já cadastrado")

        const senhaCripto = bcrypt.hashSync(senha, 10)
  
        await db.collection('usuarios').insertOne({ nome, email, senha: senhaCripto })
        res.status(201).send('Usuário cadastrado com sucesso!')

    } catch (err) {
      res.status(500).send(err.message)
    }
}

export async function postLogin(req, res){
    const { email, senha } = req.body

    try{
        const user = await db.collection('usuarios').findOne({email});
            if(!user) return res.status(404).send("Email não cadastrado!")

        const senhaCorreta = bcrypt.compareSync(senha, user.senha)
            if(!senhaCorreta) return res.status(401).send("Senha incorreta!")

        const token = uuid()
        await db.collection("sessoes").insertOne({idUsuario:user._id, token})

        res.status(200).send({idUsuario:user._id, nome: user.nome, token})

    }catch(err){
        res.status(500).send(err.message)
    }    
}