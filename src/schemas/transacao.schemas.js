import joi from 'joi'

export const inserirSchema = joi.object({
    tipo: joi.string().valid('entrada', 'saida'),
    valor: joi.number().positive().precision(2).required(),
    descricao: joi.string().required()
})