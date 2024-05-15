import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {spawn} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {format} from 'date-fns';

@Injectable()
export class BackupService {  
  
  private fileName= ""
  private backup_path= ""
  constructor(
    private readonly configService: ConfigService,
  ){
  }

  async backup(){
      this.fileName= `${format(new Date(),'dd_MM_yyyy')}.sql`
      this.backup_path= path.join("public", "backup", this.fileName)
    const wstream = fs.createWriteStream(this.backup_path)
    const dump = spawn(
      "pg_dump",
      [
        "--format=c",
        "-U",
        this.configService.get<string>('db_user'),
        `-p ${this.configService.get<number>('db_port')}`,
        this.configService.get<string>('db_name')
      ],{
        env:{
          PGUSER: this.configService.get<string>('db_user'),
          PGHOST: this.configService.get<string>('db_host'),
          PGPORT: this.configService.get<string>('db_port'),
          PGDATABASE: this.configService.get<string>('db_name'),
          PGPASSWORD: this.configService.get<string>('db_password')
        }
      }
    )

    dump.stdout
      .pipe(wstream)
      .on("finish", ()=>console.log("bd backup completed"))
      .on("error",(err)=>console.log(err))
  }

}
