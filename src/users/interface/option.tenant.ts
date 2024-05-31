import { Prisma } from "@prisma/client";

export interface IOptionMemberTenant{
  skip?: number,
  take?: number,
  where?: Prisma.MemberTenantWhereInput,
  select?: Prisma.MemberTenantSelect,
  orderBy? :Prisma.MemberTenantOrderByWithRelationInput,
  cursor?: Prisma.MemberTenantWhereUniqueInput,
  distinct?: Prisma.MemberTenantScalarFieldEnum | Prisma.MemberTenantScalarFieldEnum[],
  include?:   Prisma.MemberTenantInclude,
}