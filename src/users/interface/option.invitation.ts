import {Prisma}  from '@prisma/client'


export interface IOptionInvitation{
  skip?: number,
  take?: number,
  where?: Prisma.InvitationTenantWhereInput,
  select?: Prisma.InvitationTenantSelect,
  orderBy? :Prisma.InvitationTenantOrderByWithRelationInput,
  cursor?: Prisma.InvitationTenantWhereUniqueInput,
  distinct?: Prisma.InvitationTenantScalarFieldEnum | Prisma.InvitationTenantScalarFieldEnum[],
  include?:   Prisma.InvitationTenantInclude,
}