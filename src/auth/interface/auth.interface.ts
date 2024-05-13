import { roles } from "src/constants";

//SAAS
export interface PayloadToken{
  userId: string;
}
export interface IUseToken {
  userId:     string;
  isExpired:  boolean
}
export interface AuthTokenResult {
  userId:   string;
  iat:      number;
  exp:      number;
}
//tenant
export interface IUseTokenService {
  role:      string;
  userId:     string;
  isExpired:  boolean
}

export interface PayloadTokenTenant {
  userId:   string;
  role:     keyof typeof roles;
}

export interface AuthTokenResultService {
  role?:    string;
  userId:   string;
  iat:      number;
  exp:      number;
}