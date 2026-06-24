import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Propiedad } from '../../../core/models/propiedad.model';
import { PropiedadesService } from '../../../core/services/propiedades.service';
import { AuthService } from '../../../core/services/auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { PrecioChilenoPipe } from '../../pipes/precio-chileno.pipe';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [PrecioChilenoPipe],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.scss',
})
export class PropertyCardComponent {
  private readonly propiedadesService = inject(PropiedadesService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);

  propiedad = input.required<Propiedad>();
  mode = input<'grid' | 'list'>('grid');

  esFavorito = computed(() => {
    const user = this.auth.currentUser();
    const prop = this.propiedad();
    if (!user || user.rol !== 'arrendatario') return false;
    return user.favoritos?.includes(prop.id) ?? false;
  });

  estaEnComparador = computed(() => {
    return this.propiedadesService.comparador().includes(this.propiedad().id);
  });

  comparadorLleno = computed(() => {
    return this.propiedadesService.comparador().length >= 2;
  });

  arrendadorVerificado = computed(() => {
    const data = this.storage.getData();
    const prop = this.propiedad();
    if (!data) return false;
    const arrendador = data.users.find(u => u.id === prop.arrendadorId);
    return arrendador?.verificado ?? false;
  });

  disponibilidadTexto = computed(() => {
    const prop = this.propiedad();
    if (!prop.disponibleDesde) return 'Disponible ahora';
    const hoy = new Date();
    const desde = new Date(prop.disponibleDesde);
    if (desde <= hoy) return 'Disponible ahora';
    const mes = desde.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
    return `Disponible desde ${mes}`;
  });

  toggleFavorito(): void {
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }
    if (user.rol !== 'arrendatario') return;
    const data = this.storage.getData();
    const userInData = data.users.find(u => u.id === user.id);
    if (!userInData) return;
    if (!userInData.favoritos) userInData.favoritos = [];
    const idx = userInData.favoritos.indexOf(this.propiedad().id);
    if (idx > -1) {
      userInData.favoritos.splice(idx, 1);
    } else {
      userInData.favoritos.push(this.propiedad().id);
    }
    this.storage.setData(data);
    this.auth.refreshCurrentUser();
  }

  toggleComparador(): void {
    this.propiedadesService.toggleComparador(this.propiedad().id);
  }

  verDetalle(): void {
    this.router.navigate(['/propiedad', this.propiedad().id]);
  }
}
