import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PropiedadesService } from '../../core/services/propiedades.service';
import { PrecioChilenoPipe } from '../../shared/pipes/precio-chileno.pipe';
import { Propiedad } from '../../core/models/propiedad.model';

@Component({
  selector: 'app-comparador',
  standalone: true,
  imports: [RouterLink, PrecioChilenoPipe],
  templateUrl: './comparador.component.html',
  styleUrl: './comparador.component.scss',
})
export class ComparadorComponent {
  private readonly propiedadesService = inject(PropiedadesService);
  private readonly router = inject(Router);

  propiedades = computed<Propiedad[]>(() =>
    this.propiedadesService.comparador()
      .map(id => this.propiedadesService.getPropiedadById(id))
      .filter((p): p is Propiedad => p !== undefined)
  );

  tieneDosPropiedades = computed(() => this.propiedades().length === 2);

  quitarPropiedad(id: string): void {
    this.propiedadesService.toggleComparador(id);
  }

  volverExplorar(): void {
    this.router.navigate(['/']);
  }

  getMejorValor(attr: keyof Propiedad, higherIsBetter: boolean): number {
    const props = this.propiedades();
    if (props.length < 2) return -1;
    const v0 = props[0][attr] as number;
    const v1 = props[1][attr] as number;
    if (v0 === v1) return -1;
    if (higherIsBetter) return v0 > v1 ? 0 : 1;
    return v0 < v1 ? 0 : 1;
  }

  isBest(attr: keyof Propiedad, higherIsBetter: boolean, idx: number): boolean {
    return this.getMejorValor(attr, higherIsBetter) === idx;
  }

  getContratoLabel(tipo: string): string {
    return tipo === 'anio_corrido' ? 'Año corrido' : 'Marzo – Dic';
  }

  getCalefaccionLabel(tipos: string[]): string {
    const labels: Record<string, string> = { pellet: 'Pellet', 'le\u00F1a': 'Leña', electrica: 'Eléctrica', gas: 'Gas' };
    return tipos.map(t => labels[t] ?? t).join(', ');
  }
}
