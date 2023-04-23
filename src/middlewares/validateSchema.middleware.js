
export function validate(schema){

    return (req, res, next) =>{

        const validacao = schema.validate(req.body, { abortEarly: false })
      
        if (validacao.error) {
            const errors = validacao.error.details.map(detail => detail.message)
            return res.status(422).send(errors)
        }
    
        next()
    }

}
