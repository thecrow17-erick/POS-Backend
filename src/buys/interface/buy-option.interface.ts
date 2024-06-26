import { Prisma } from "@prisma/client";

export interface IOptionBuys{
  skip?: number,
  take?: number,
  where?: Prisma.BuysWhereInput,
  select?: Prisma.BuysSelect,
  orderBy? :Prisma.BuysOrderByWithRelationInput,
  cursor?: Prisma.BuysWhereUniqueInput,
  distinct?: Prisma.BuysScalarFieldEnum | Prisma.BuysScalarFieldEnum[],
  include?:   Prisma.BuysInclude,
}