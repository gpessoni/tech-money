import Joi from "joi"

export const createIncomeValidation = Joi.object({
    amount: Joi.number().positive().required().messages({
        "any.required": "Valor é obrigatório",
        "number.base": "Valor deve ser um número",
        "number.positive": "Valor deve ser positivo"
    }),
    description: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Descrição é obrigatória",
        "string.empty": "Descrição não pode ser vazia",
        "string.min": "Descrição deve ter pelo menos {#limit} caracteres",
        "string.max": "Descrição deve ter no máximo {#limit} caracteres"
    }),
    date: Joi.date().default(Date.now).messages({
        "date.base": "Data inválida"
    }),
    userId: Joi.string().uuid().required().messages({
        "any.required": "ID do usuário é obrigatório",
        "string.guid": "ID do usuário inválido"
    })
})

export const updateIncomeValidation = Joi.object({
    amount: Joi.number().positive().messages({
        "number.base": "Valor deve ser um número",
        "number.positive": "Valor deve ser positivo"
    }),
    description: Joi.string().trim().min(2).max(100).messages({
        "string.min": "Descrição deve ter pelo menos {#limit} caracteres",
        "string.max": "Descrição deve ter no máximo {#limit} caracteres"
    }),
    date: Joi.date().messages({
        "date.base": "Data inválida"
    })
})

export const deleteIncomeValidation = Joi.string().uuid().required()
