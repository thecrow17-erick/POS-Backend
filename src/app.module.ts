import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';
import { EmployeeModule } from './employee';
import {ConfigModule} from '@nestjs/config';
import { EnvConfig, EnvSchema } from './config';
import { NodemailersModule } from './nodemailers/nodemailers.module';
import { CommonModule } from './common/common.module';
import { BranchModule } from './branch/branch.module';
import { CityModule } from './city/city.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: EnvSchema,
    }),
    PrismaModule, 
    EmployeeModule, 
    NodemailersModule, CommonModule, BranchModule, CityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(){
    console.log(process.env.TZ)
  }

}
