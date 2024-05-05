interface IPaymentMethod{
  description : string;
}

export const dataPaymentMethod: IPaymentMethod[] = [
  {
    description: "Tarjeta",
  },
  {
    description: "QR",
  },
  {
    description: "Efectivo"
  }
]