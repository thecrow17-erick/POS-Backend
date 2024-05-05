interface ISuscription{
  name:       string;
  duracion:   number;
  price:      string;
}

export const dataSuscription: ISuscription[] = [
  {
    name: "Mensual",
    duracion: 30,
    price: "70.59",
  },
  {
    name: "Trimestral",
    duracion: 90,
    price: "200.50",
  },
  {
    name: "Anual",
    duracion: 365,
    price: "500.40",
  }
]