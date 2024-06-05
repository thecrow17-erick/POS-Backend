
export const EnvConfig = () => ({
  enviroment : process.env.NODE_ENV || 'dev',
  port: +process.env.PORT || 3001,
  database_url: process.env.DATABASE_URL,
  account_email: process.env.ACCOUNT_EMAIL,
  password_email: process.env.PASSWORD_EMAIL ,
  host_email: process.env.HOST_EMAIL,
  secret_key_jwt: process.env.SECRET_KEY_JWT,
  stripe_key: process.env.STRIPE_KEY,
  stripe_sucess_url: process.env.STRIPE_SUCESS_URL,
  stripe_cancel_url: process.env.STRIPE_CANCEL_URL,
  accout_name_storage: process.env.ACCOUNT_NAME_STORAGE,
  key_account_storage: process.env.KEY_ACCOUNT_STORAGE,
  account_host_storage: process.env.ACCOUT_HOST_STORAGE,
  conection_string_storage: process.env.CONECTION_STRING_STORAGE,
  db_host: process.env.DB_HOST,
  db_port: process.env.DB_PORT,
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  db_name: process.env.DB_NAME,
  backup_hour: process.env.BACKUP_HOUR,
  backup_min: process.env.BACKUP_MIN,
  backup_month: process.env.BACKUP_MONTH,
  frontend_url: process.env.FRONTEND_URL,
  setup_insign: process.env.SETUP_INSIGN_AZURE
})

