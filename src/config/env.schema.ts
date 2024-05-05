import * as Joi from 'joi';

export const EnvSchema = Joi.object({
  DATABASE_URL: Joi.required(),
  PORT: Joi.number().default(3000),
  ACCOUNT_EMAIL: Joi.string().required(),
  PASSWORD_EMAIL: Joi.string().required(),
  HOST_EMAIL: Joi.string().required(),
  SECRET_KEY_JWT: Joi.string().required(),
})