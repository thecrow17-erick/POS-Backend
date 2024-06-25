import { Prisma } from "@prisma/client";

export interface IOptionInventory{
  skip?: number,
  take?: number,
  where?: Prisma.InventoryWhereInput,
  select?: Prisma.InventorySelect,
  orderBy? :Prisma.InventoryOrderByWithRelationInput,
  cursor?: Prisma.InventoryWhereUniqueInput,
  distinct?: Prisma.InventoryScalarFieldEnum | Prisma.InventoryScalarFieldEnum[],
  include?:   Prisma.InventoryInclude,
}