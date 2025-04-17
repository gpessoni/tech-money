import Joi from "joi"

export const createInvestmentValidation = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Nome é obrigatório",
        "string.empty": "Nome não pode ser vazio",
        "string.min": "Nome deve ter pelo menos {#limit} caracteres",
        "string.max": "Nome deve ter no máximo {#limit} caracteres"
    }),
    amount: Joi.number().positive().required().messages({
        "any.required": "Valor é obrigatório",
        "number.base": "Valor deve ser um número",
        "number.positive": "Valor deve ser positivo"
    }),
    yield: Joi.number().positive().required().messages({
        "any.required": "Rendimento é obrigatório",
        "number.base": "Rendimento deve ser um número",
        "number.positive": "Rendimento deve ser positivo"
    }),
    category: Joi.string().trim().required().messages({
        "any.required": "Categoria é obrigatória",
        "string.empty": "Categoria não pode ser vazia"
    }),
    userId: Joi.string().uuid().required().messages({
        "any.required": "ID do usuário é obrigatório",
        "string.guid": "ID do usuário inválido"
    })
})

export const updateInvestmentValidation = Joi.object({
    name: Joi.string().trim().min(2).max(100).messages({
        "string.min": "Nome deve ter pelo menos {#limit} caracteres",
        "string.max": "Nome deve ter no máximo {#limit} caracteres"
    }),
    amount: Joi.number().positive().messages({
        "number.base": "Valor deve ser um número",
        "number.positive": "Valor deve ser positivo"
    }),
    yield: Joi.number().positive().messages({
        "number.base": "Rendimento deve ser um número",
        "number.positive": "Rendimento deve ser positivo"
    }),
    category: Joi.string().trim().messages({
        "string.empty": "Categoria não pode ser vazia"
    })
})

export const deleteInvestmentValidation = Joi.string().uuid().required()
