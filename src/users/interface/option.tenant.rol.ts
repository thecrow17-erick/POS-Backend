import {Prisma}  from '@prisma/client'


export interface IOptionRoleTenant{
  skip?: number,
  take?: number,
  where?: Prisma.RolWhereInput,
  select?: Prisma.RolSelect,
  orderBy? :Prisma.RolOrderByWithRelationInput,
  cursor?: Prisma.RolWhereUniqueInput,
  distinct?: Prisma.RolScalarFieldEnum | Prisma.RolScalarFieldEnum[],
  include?:   Prisma.RolInclude,
}