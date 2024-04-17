import { Prisma } from "@prisma/client";

export interface IOptionCitys{
  skip?: number,
  take?: number,
  where?: Prisma.CityWhereInput,
  select?: Prisma.CitySelect,
  orderBy? :Prisma.CityOrderByWithRelationInput,
  cursor?: Prisma.CityWhereUniqueInput,
  distinct?: Prisma.CityScalarFieldEnum | Prisma.CityScalarFieldEnum[],
}