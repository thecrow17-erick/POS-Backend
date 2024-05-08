
export const EnvConfig = () => ({
  enviroment : process.env.NODE_ENV || 'dev',
  port: +process.env.PORT || 3001,
  database_url: process.env.DATABASE_URL,
  account_email: process.env.MAIL_USER,
  password_email: process.env.MAIL_PASSWORD ,
  host_email: process.env.MAIL_HOST,
  secret_key_jwt: process.env.SECRET_KEY_JWT,
})
