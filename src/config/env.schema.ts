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
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER:Joi.string().required(),
  DB_PASSWORD:Joi.string().required(),
  DB_NAME:Joi.string().required(),
  BACKUP_HOUR:Joi.number().default(2),
  BACKUP_MIN:Joi.number().default(0),
  BACKUP_MONTH:Joi.number().default(3),
  FRONTEND_URL: Joi.string().required(),
  SETUP_INSIGN_AZURE: Joi.string().required()
})