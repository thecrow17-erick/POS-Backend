export interface ISale {
  nombre_empresa: string;
  nro_factura:    number;
  IdUsuario:      number;
  clientName:     string;
  logoUrl:        string;
  products:       Product[];
}

export interface Product {
  ID:       number;
  Producto: string;
  Precio:   string;
  Cantidad: number;
  Total:    number;
}
