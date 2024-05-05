declare namespace Express {
  interface Request {
    UserId:     string;
    roleId:     number;
    tenantId:   number; 
  }
}