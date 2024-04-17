import { Prisma } from "@prisma/client";

export interface IOptionEmployees{
  skip?: number,
  take?: number,
  where?: Prisma.EmployeeWhereInput,
  select?: Prisma.EmployeeSelect,
  orderBy? :Prisma.EmployeeOrderByWithRelationInput,
  cursor?: Prisma.EmployeeWhereUniqueInput,
  distinct?: Prisma.EmployeeScalarFieldEnum | Prisma.EmployeeScalarFieldEnum[],
}