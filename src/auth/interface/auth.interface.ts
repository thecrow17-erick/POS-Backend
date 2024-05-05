import { role } from "src/constants";


export interface IUseToken {
  role:       string;
  userId:     string;
  isExpired:  boolean
}

export interface PayloadTokenTenant {
  userId: string;
  role:   role;
}
export interface PayloadToken{
  userId: string;
}

export interface AuthTokenResult {
  role:     string;
  userId:   string;
  iat:      number;
  exp:      number;
}