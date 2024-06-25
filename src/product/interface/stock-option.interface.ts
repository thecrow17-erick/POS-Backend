import { Prisma } from "@prisma/client";

export interface IOptionStock{
  skip?: number,
  take?: number,
  where?: Prisma.StockWhereInput,
  select?: Prisma.StockSelect,
  orderBy? :Prisma.StockOrderByWithRelationInput,
  cursor?: Prisma.StockWhereUniqueInput,
  distinct?: Prisma.StockScalarFieldEnum | Prisma.StockScalarFieldEnum[],
  include?:   Prisma.StockInclude,
}