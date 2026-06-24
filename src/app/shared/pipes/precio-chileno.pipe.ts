import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'precioChileno',
  standalone: true,
})
export class PrecioChilenoPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '';
    return '$' + new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}
