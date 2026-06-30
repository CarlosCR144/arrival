import { Injectable, signal, computed, inject } from '@angular/core';
import { Propiedad } from '../models/propiedad.model';
import { FiltrosState, FILTROS_INITIAL } from '../models/filtros.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class PropiedadesService {
  private storage = inject(StorageService);

  propiedades = signal<Propiedad[]>([]);
  filtros = signal<FiltrosState>({ ...FILTROS_INITIAL });
  comparador = signal<string[]>([]);
  busqueda = signal<string>('');

  propiedadesFiltradas = computed(() => {
    // Solo mostrar las activas o las que no tienen estado (legacy data)
    let result = this.propiedades().filter(p => !p.estado || p.estado === 'Activa');
    const f = this.filtros();
    const busq = this.busqueda().toLowerCase().trim();

    // Filtro de búsqueda
    if (busq) {
      result = result.filter(p =>
        p.titulo.toLowerCase().includes(busq) ||
        p.sector.toLowerCase().includes(busq) ||
        p.direccionReferencial.toLowerCase().includes(busq)
      );
    }

    // Filtro por sector
    if (f.sector !== 'todos') {
      result = result.filter(p => p.sector === f.sector);
    }

    // Filtro por rango de precio
    result = result.filter(p => p.precio >= f.precioMin && p.precio <= f.precioMax);

    // Filtro por tipo de contrato
    if (f.tipoContrato !== 'todos') {
      result = result.filter(p => p.tipoContrato === f.tipoContrato);
    }

    // Filtro de calefacción (la propiedad tiene al menos uno de los tipos seleccionados)
    if (f.calefaccion.length > 0) {
      result = result.filter(p =>
        p.calefaccion.some(c => f.calefaccion.includes(c))
      );
    }

    // Filtro amoblado
    if (f.amoblado !== null) {
      result = result.filter(p => p.amoblado === f.amoblado);
    }

    // Filtro mascotas
    if (f.aceptaMascotas !== null) {
      result = result.filter(p => p.aceptaMascotas === f.aceptaMascotas);
    }

    // Filtro habitaciones mínimas
    if (f.habitacionesMin !== null) {
      result = result.filter(p => p.habitaciones >= f.habitacionesMin!);
    }

    // Filtro baños mínimos
    if (f.banosMin !== null) {
      result = result.filter(p => p.banos >= f.banosMin!);
    }

    // Filtro metros cuadrados mínimos
    if (f.metrosCuadradosMin > 0) {
      result = result.filter(p => p.metrosCuadrados >= f.metrosCuadradosMin);
    }

    return result;
  });

  cargarPropiedades(): void {
    const data = this.storage.getData();
    if (data) {
      this.propiedades.set(data.propiedades);
      // Restaurar comparador desde sesión
      if (data.session?.comparador) {
        this.comparador.set(data.session.comparador);
      }
      // Restaurar filtros desde sesión
      if (data.session?.filtrosActivos) {
        this.filtros.set(data.session.filtrosActivos);
      }
    }
  }

  getPropiedadById(id: string): Propiedad | undefined {
    return this.propiedades().find(p => p.id === id);
  }

  getPropiedadesByArrendador(userId: string): Propiedad[] {
    return this.propiedades().filter(p => p.arrendadorId === userId);
  }

  agregarPropiedad(propiedad: Propiedad): void {
    const data = this.storage.getData();
    propiedad.estado = 'Activa';
    data.propiedades.push(propiedad);
    this.storage.setData(data);
    this.propiedades.set([...data.propiedades]);
  }

  actualizarPropiedad(id: string, updates: Partial<Propiedad>): void {
    const data = this.storage.getData();
    const index = data.propiedades.findIndex(p => p.id === id);
    if (index !== -1) {
      data.propiedades[index] = { ...data.propiedades[index], ...updates };
      this.storage.setData(data);
      this.propiedades.set([...data.propiedades]);
    }
  }

  cambiarEstadoPropiedad(id: string, estado: 'Activa' | 'Oculta' | 'Eliminada'): void {
    const data = this.storage.getData();
    const index = data.propiedades.findIndex(p => p.id === id);
    if (index !== -1) {
      data.propiedades[index].estado = estado;
      this.storage.setData(data);
      this.propiedades.set([...data.propiedades]);
    }
  }

  eliminarPropiedadDefinitiva(id: string): void {
    const data = this.storage.getData();
    data.propiedades = data.propiedades.filter(p => p.id !== id);
    // Remove from comparador if exists
    data.session.comparador = data.session.comparador.filter(c => c !== id);
    this.comparador.set(data.session.comparador);
    // Remove from users favorites
    data.users.forEach(u => {
      if (u.favoritos) {
        u.favoritos = u.favoritos.filter(fid => fid !== id);
      }
    });
    this.storage.setData(data);
    this.propiedades.set([...data.propiedades]);
  }

  toggleComparador(id: string): void {
    const current = this.comparador();
    const idx = current.indexOf(id);
    let updated: string[];
    if (idx > -1) {
      updated = current.filter(c => c !== id);
    } else if (current.length < 2) {
      updated = [...current, id];
    } else {
      return; // Máximo 2
    }
    this.comparador.set(updated);
    // Persistir en sesión
    const data = this.storage.getData();
    data.session.comparador = updated;
    this.storage.setData(data);
  }

  limpiarComparador(): void {
    this.comparador.set([]);
    const data = this.storage.getData();
    data.session.comparador = [];
    this.storage.setData(data);
  }

  actualizarFiltros(partial: Partial<FiltrosState>): void {
    const current = this.filtros();
    const updated = { ...current, ...partial };
    this.filtros.set(updated);
    // Persistir en sesión
    const data = this.storage.getData();
    data.session.filtrosActivos = updated;
    this.storage.setData(data);
  }

  resetFiltros(): void {
    this.filtros.set({ ...FILTROS_INITIAL });
    const data = this.storage.getData();
    data.session.filtrosActivos = { ...FILTROS_INITIAL };
    this.storage.setData(data);
  }
}
