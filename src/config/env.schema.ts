import * as Joi from 'joi';

export const EnvSchema = Joi.object({
  DATABASE_URL: Joi.required(),
  PORT: Joi.number().default(3000),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  SECRET_KEY_JWT: Joi.string().required(),
})