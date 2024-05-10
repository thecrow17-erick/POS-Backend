import { Prisma } from "@prisma/client";

export interface IOptionProducts{
  skip?: number,
  take?: number,
  where?: Prisma.ProductWhereInput,
  select?: Prisma.ProductSelect,
  orderBy? :Prisma.ProductOrderByWithRelationInput,
  cursor?: Prisma.ProductWhereUniqueInput,
  distinct?: Prisma.ProductScalarFieldEnum | Prisma.ProductScalarFieldEnum[],
}