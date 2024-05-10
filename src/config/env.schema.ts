import * as Joi from 'joi';

export const EnvSchema = Joi.object({
  DATABASE_URL: Joi.required(),
  PORT: Joi.number().default(3000),
  ACCOUNT_EMAIL: Joi.string().required(),
  PASSWORD_EMAIL: Joi.string().required(),
  HOST_EMAIL: Joi.string().required(),
  SECRET_KEY_JWT: Joi.string().required(),
  STRIPE_KEY: Joi.string().required(),
  STRIPE_SUCESS_URL: Joi.string().required(),
  STRIPE_CANCEL_URL: Joi.string().required(),
  ACCOUNT_NAME_STORAGE: Joi.string().required(),
  KEY_ACCOUNT_STORAGE : Joi.string().required(),
  ACCOUT_HOST_STORAGE : Joi.string().required(),
  CONECTION_STRING_STORAGE: Joi.string().required(),
})