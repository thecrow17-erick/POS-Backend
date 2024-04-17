
export const EnvConfig = () => ({
  enviroment : process.env.NODE_ENV || 'dev',
  port: +process.env.PORT || 3001,
  database_url: process.env.DATABASE_URL,
  account_email: process.env.ACCOUNT_EMAIL,
  password_email: process.env.PASSWORD_EMAIL ,
  host_email: process.env.HOST_EMAIL,
})
