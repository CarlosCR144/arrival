import { Injectable, inject, computed, Signal } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private storage = inject(StorageService);
  private auth = inject(AuthService);

  /**
   * Retorna un Signal<boolean> computado que rastrea reactivamente si
   * la propiedad dada está en los favoritos del usuario actual.
   */
  isFavorito(propiedadId: string): Signal<boolean> {
    return computed(() => {
      const user = this.auth.currentUser();
      if (!user || user.rol !== 'arrendatario') return false;
      return user.favoritos?.includes(propiedadId) ?? false;
    });
  }

  toggleFavorito(propiedadId: string): void {
    const user = this.auth.currentUser();
    if (!user || user.rol !== 'arrendatario') return;

    const data = this.storage.getData();
    const userInData = data.users.find(u => u.id === user.id);
    if (!userInData) return;

    if (!userInData.favoritos) {
      userInData.favoritos = [];
    }

    const idx = userInData.favoritos.indexOf(propiedadId);
    if (idx > -1) {
      userInData.favoritos.splice(idx, 1);
    } else {
      userInData.favoritos.push(propiedadId);
    }

    this.storage.setData(data);
    // Refrescar señal de currentUser para activar reactividad
    this.auth.refreshCurrentUser();
  }

  getFavoritos(): string[] {
    const user = this.auth.currentUser();
    if (!user || user.rol !== 'arrendatario') return [];
    return user.favoritos ?? [];
  }
}
