import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropiedadesService } from '../../core/services/propiedades.service';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { ComparadorFabComponent } from '../../shared/components/comparador-fab/comparador-fab.component';
import { PrecioChilenoPipe } from '../../shared/pipes/precio-chileno.pipe';
import { TipoCalefaccion } from '../../core/models/propiedad.model';

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [FormsModule, PropertyCardComponent, ComparadorFabComponent, PrecioChilenoPipe],
  templateUrl: './explorar.component.html',
  styleUrl: './explorar.component.scss',
})
export class ExplorarComponent {
  readonly propiedadesService = inject(PropiedadesService);

  readonly sectores = [
    'todos', 'Isla Teja', 'Centro', 'Barrios Bajos',
    'Las Ánimas', 'Huachocopihue', 'Miraflores', 'Torobayo', 'Collico',
  ];

  readonly calefaccionOpciones: TipoCalefaccion[] = ['pellet', 'leña', 'electrica', 'gas'];

  ordenamiento = signal<'recomendados' | 'precio_asc' | 'precio_desc' | 'recientes'>('recomendados');
  propiedadesMostradas = signal(6);
  showMobileFilters = signal(false);

  toggleMobileFilters(): void {
    this.showMobileFilters.update(v => !v);
  }

  propiedadesOrdenadas = computed(() => {
    const props = [...this.propiedadesService.propiedadesFiltradas()];
    switch (this.ordenamiento()) {
      case 'precio_asc': return props.sort((a, b) => a.precio - b.precio);
      case 'precio_desc': return props.sort((a, b) => b.precio - a.precio);
      case 'recientes': return props.sort((a, b) =>
        new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
      );
      default: return props;
    }
  });

  propiedadesVisibles = computed(() =>
    this.propiedadesOrdenadas().slice(0, this.propiedadesMostradas())
  );

  totalFiltradas = computed(() => this.propiedadesService.propiedadesFiltradas().length);

  filtrosActivos = computed(() => {
    const f = this.propiedadesService.filtros();
    const labels: string[] = [];
    if (f.sector !== 'todos') labels.push(f.sector);
    if (f.amoblado === true) labels.push('Amoblado');
    if (f.aceptaMascotas === true) labels.push('Mascotas');
    if (f.tipoContrato !== 'todos') labels.push(f.tipoContrato === 'año_corrido' ? 'Año corrido' : 'Mar-Dic');
    if (f.calefaccion.length > 0) labels.push(...f.calefaccion);
    if (f.habitacionesMin !== null) labels.push(`Mín. ${f.habitacionesMin} hab.`);
    if (f.banosMin !== null) labels.push(`Mín. ${f.banosMin} baño(s)`);
    if (f.metrosCuadradosMin > 0) labels.push(`Mín. ${f.metrosCuadradosMin}m²`);
    return labels.join(' · ');
  });

  cargarMas(): void {
    this.propiedadesMostradas.update(n => n + 6);
  }

  onSectorChange(event: Event): void {
    const sector = (event.target as HTMLSelectElement).value;
    this.propiedadesService.actualizarFiltros({ sector });
    this.propiedadesMostradas.set(6);
  }

  onPrecioMaxChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.propiedadesService.actualizarFiltros({ precioMax: Number(value) });
  }

  onOrdenamientoChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'recomendados' | 'precio_asc' | 'precio_desc' | 'recientes';
    this.ordenamiento.set(value);
  }

  onTipoContratoChange(tipoContrato: string): void {
    this.propiedadesService.actualizarFiltros({ tipoContrato });
  }

  toggleCalefaccion(tipo: string): void {
    const current = this.propiedadesService.filtros().calefaccion as string[];
    const idx = current.indexOf(tipo);
    const updated = idx > -1
      ? current.filter(c => c !== tipo)
      : [...current, tipo];
    this.propiedadesService.actualizarFiltros({ calefaccion: updated as TipoCalefaccion[] });
  }

  toggleAmoblado(): void {
    const current = this.propiedadesService.filtros().amoblado;
    this.propiedadesService.actualizarFiltros({ amoblado: current === true ? null : true });
  }

  toggleMascotas(): void {
    const current = this.propiedadesService.filtros().aceptaMascotas;
    this.propiedadesService.actualizarFiltros({ aceptaMascotas: current === true ? null : true });
  }

  aplicarFiltros(): void {
    this.propiedadesMostradas.set(6);
    this.showMobileFilters.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFiltros(): void {
    this.propiedadesService.resetFiltros();
    this.propiedadesMostradas.set(6);
  }

  getSectorLabel(sector: string): string {
    return sector === 'todos' ? 'Valdivia, Chile (Todos)' : sector;
  }

  getCalefaccionLabel(tipo: string): string {
    const labels: Record<string, string> = {
      pellet: 'Pellet', leña: 'Leña', electrica: 'Eléctrica', gas: 'Gas',
    };
    return labels[tipo] ?? tipo;
  }

  isCalefaccionActive(tipo: string): boolean {
    return this.propiedadesService.filtros().calefaccion.includes(tipo as TipoCalefaccion);
  }

  onHabitacionesChange(val: number | null): void {
    const current = this.propiedadesService.filtros().habitacionesMin;
    this.propiedadesService.actualizarFiltros({ habitacionesMin: current === val ? null : val });
  }

  onBanosChange(val: number | null): void {
    const current = this.propiedadesService.filtros().banosMin;
    this.propiedadesService.actualizarFiltros({ banosMin: current === val ? null : val });
  }

  onMetrosChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.propiedadesService.actualizarFiltros({ metrosCuadradosMin: Number(value) });
  }
}
