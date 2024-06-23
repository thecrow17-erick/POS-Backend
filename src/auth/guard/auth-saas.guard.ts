import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { useToken } from 'src/utils';
import { UsersService } from 'src/users/service';
import { Request } from 'express';

@Injectable()
export class AuthSaasGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService
  ){}
  
  async canActivate(
    context: ExecutionContext,
  ){
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers["auth-token"]
    if(!token || Array.isArray(token)) 
      throw new UnauthorizedException("subdomain in not domain");

    const manageToken = useToken(token);
    if(typeof manageToken === "string")
      throw new UnauthorizedException(manageToken);
    
    if(manageToken.isExpired)
      throw new UnauthorizedException('Token expired');
    
    const findUser = await this.userService.findIdUser(manageToken.userId);
    
    if(!findUser)
      throw new UnauthorizedException("user not found")
    
    req.UserId = findUser.id;
    return true;
  }
}
