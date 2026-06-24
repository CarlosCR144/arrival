import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PropiedadesService } from '../../core/services/propiedades.service';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { Propiedad } from '../../core/models/propiedad.model';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [PropertyCardComponent, RouterLink],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss',
})
export class FavoritosComponent {
  private readonly auth = inject(AuthService);
  private readonly propiedadesService = inject(PropiedadesService);

  propiedadesFavoritas = computed<Propiedad[]>(() => {
    const user = this.auth.currentUser();
    if (!user || user.rol !== 'arrendatario') return [];
    const favIds = user.favoritos ?? [];
    return favIds
      .map(id => this.propiedadesService.getPropiedadById(id))
      .filter((p): p is Propiedad => p !== undefined);
  });
}
