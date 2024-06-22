import { $Enums } from "@prisma/client";

export interface IPermissions {
  desc: string;
  module: $Enums.Module
}