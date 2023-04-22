import joi from 'joi'

export const inserirSchema = joi.object({
    valor: joi.number().positive().precision(2).required(),
    descricao: joi.string().required()
})

export const tipoSchema = joi.object({
    tipo: joi.string().valid('entrada', 'saida')
})