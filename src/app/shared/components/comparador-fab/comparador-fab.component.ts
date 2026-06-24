import { Component, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PropiedadesService } from '../../../core/services/propiedades.service';
import { Propiedad } from '../../../core/models/propiedad.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-comparador-fab',
  standalone: true,
  imports: [],
  templateUrl: './comparador-fab.component.html',
  styleUrl: './comparador-fab.component.scss',
})
export class ComparadorFabComponent {
  private readonly propiedadesService = inject(PropiedadesService);
  private readonly router = inject(Router);

  comparadorIds = computed(() => this.propiedadesService.comparador());

  propiedadesComparador = computed(() => {
    const ids = this.comparadorIds();
    return ids
      .map(id => this.propiedadesService.getPropiedadById(id))
      .filter((p): p is Propiedad => p !== undefined);
  });

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    ),
    { initialValue: this.router.url } 
  );

  visible = computed(() => {
    return this.comparadorIds().length >= 1 && !this.currentUrl().includes('/comparar');
  });

  puedeComparar = computed(() => this.comparadorIds().length === 2);

  comparar(): void {
    const ids = this.comparadorIds();
    if (ids.length === 2) {
      this.router.navigate(['/comparar'], {
        queryParams: { ids: ids.join(',') },
      });
    }
  }

  cerrar(): void {
    this.propiedadesService.limpiarComparador();
  }
}
