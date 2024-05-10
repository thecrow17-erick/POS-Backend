import { Prisma } from "@prisma/client";

export interface IOptionProviders{
  skip?: number,
  take?: number,
  where?: Prisma.ProviderWhereInput,
  select?: Prisma.ProviderSelect,
  orderBy? :Prisma.ProviderOrderByWithRelationInput,
  cursor?: Prisma.ProviderWhereUniqueInput,
  distinct?: Prisma.ProviderScalarFieldEnum | Prisma.ProductScalarFieldEnum[],
  include?:   Prisma.ProviderInclude,
}