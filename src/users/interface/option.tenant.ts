import { Prisma } from "@prisma/client";

export interface IOptionMemberTenant{
  skip?: number,
  take?: number,
  where?: Prisma.memberTenantWhereInput,
  select?: Prisma.memberTenantSelect,
  orderBy? :Prisma.memberTenantOrderByWithRelationInput,
  cursor?: Prisma.memberTenantWhereUniqueInput,
  distinct?: Prisma.MemberTenantScalarFieldEnum | Prisma.MemberTenantScalarFieldEnum[],
  include?:   Prisma.memberTenantInclude,
}