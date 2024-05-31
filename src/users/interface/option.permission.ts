import {Prisma}  from '@prisma/client'


export interface IOptionPermission{
  skip?: number,
  take?: number,
  where?: Prisma.PermissionWhereInput,
  select?: Prisma.PermissionSelect,
  orderBy? :Prisma.PermissionOrderByWithRelationInput,
  cursor?: Prisma.PermissionWhereUniqueInput,
  distinct?: Prisma.PermissionScalarFieldEnum | Prisma.PermissionScalarFieldEnum[],
  include?:   Prisma.PermissionInclude,
}