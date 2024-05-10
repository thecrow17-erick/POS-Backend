import { Prisma } from "@prisma/client";

export interface IOptionAtm{
  skip?: number,
  take?: number,
  where?: Prisma.AtmWhereInput,
  select?: Prisma.AtmSelect,
  orderBy? :Prisma.AtmOrderByWithRelationInput,
  cursor?: Prisma.AtmWhereUniqueInput,
  distinct?: Prisma.AtmScalarFieldEnum | Prisma.AtmScalarFieldEnum[],
  include?:   Prisma.AtmInclude,
}