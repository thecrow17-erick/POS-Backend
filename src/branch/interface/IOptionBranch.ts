import { Prisma } from "@prisma/client";

export interface IOptionBranch{
  skip?: number,
  take?: number,
  where?: Prisma.BranchWhereInput,
  select?: Prisma.BranchSelect,
  orderBy? :Prisma.BranchOrderByWithRelationInput,
  cursor?: Prisma.BranchWhereUniqueInput,
  distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[],
}