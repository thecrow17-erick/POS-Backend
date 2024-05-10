import {Prisma} from '@prisma/client';

export interface IOptionSuscription{
  skip?: number,
  take?: number,
  where?: Prisma.SuscriptionWhereInput,
  select?: Prisma.SuscriptionSelect,
  orderBy? :Prisma.SuscriptionOrderByWithRelationInput,
  cursor?: Prisma.SuscriptionWhereUniqueInput,
  distinct?: Prisma.SuscriptionScalarFieldEnum | Prisma.SuscriptionScalarFieldEnum[],
  include?:   Prisma.SuscriptionInclude,
}