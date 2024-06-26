export class Formatter {
  static currency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  static formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  static currencyDate(value: number): string {
    return `$${value.toFixed(2)}`;
  }
}
