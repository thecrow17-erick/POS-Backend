export interface IPermissions {
  rolId:      number,
  moduleId:   number,
  get:        boolean,
  create:     boolean,
  edit:       boolean,
  delete:     boolean,
  tenantId:   number, 
}