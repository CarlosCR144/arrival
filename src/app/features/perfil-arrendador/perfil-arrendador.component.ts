import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { PropiedadesService } from '../../core/services/propiedades.service';
import { AuthService } from '../../core/services/auth.service';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { Usuario } from '../../core/models/usuario.model';
import { Propiedad, ResenaArrendatario } from '../../core/models/propiedad.model';

@Component({
  selector: 'app-perfil-arrendador',
  standalone: true,
  imports: [PropertyCardComponent],
  templateUrl: './perfil-arrendador.component.html',
  styleUrl: './perfil-arrendador.component.scss',
})
export class PerfilArrendadorComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly storage = inject(StorageService);
  private readonly propiedadesService = inject(PropiedadesService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  arrendador = signal<Usuario | null>(null);
  propiedades = signal<Propiedad[]>([]);

  esPropietario = computed(() => {
    return this.auth.currentUser()?.id === this.arrendador()?.id;
  });

  activasCount = computed(() => this.propiedades().filter(p => !p.estado || p.estado === 'Activa').length);
  ocultasCount = computed(() => this.propiedades().filter(p => p.estado === 'Oculta').length);
  eliminadasCount = computed(() => this.propiedades().filter(p => p.estado === 'Eliminada').length);

  todasResenas = computed((): ResenaArrendatario[] => {
    return this.propiedades()
      .flatMap(p => p.resenas)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  });

  starsArray = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.cargarPerfil(id);
  }

  cargarPerfil(id: string): void {
    const data = this.storage.getData();
    const user = data.users.find(u => u.id === id) ?? null;
    this.arrendador.set(user);
    if (user) {
      let props = this.propiedadesService.getPropiedadesByArrendador(id);
      if (this.auth.currentUser()?.id !== id) {
        props = props.filter(p => !p.estado || p.estado === 'Activa');
      }
      this.propiedades.set(props);
    }
  }

  editarPropiedad(id: string): void {
    this.router.navigate(['/publicar'], { queryParams: { edit: id } });
  }

  toggleVisibilidad(prop: Propiedad): void {
    const nuevoEstado = prop.estado === 'Oculta' ? 'Activa' : 'Oculta';
    this.propiedadesService.cambiarEstadoPropiedad(prop.id, nuevoEstado);
    this.cargarPerfil(this.arrendador()!.id);
  }

  restaurarPropiedad(id: string): void {
    this.propiedadesService.cambiarEstadoPropiedad(id, 'Activa');
    this.cargarPerfil(this.arrendador()!.id);
  }

  propiedadAEliminar = signal<string | null>(null);
  tipoEliminacion = signal<'soft' | 'hard'>('soft');

  eliminarPropiedad(id: string): void {
    this.propiedadAEliminar.set(id);
    this.tipoEliminacion.set('soft');
  }

  eliminarDefinitivo(id: string): void {
    this.propiedadAEliminar.set(id);
    this.tipoEliminacion.set('hard');
  }

  confirmarEliminacion(): void {
    const id = this.propiedadAEliminar();
    if (id) {
      if (this.tipoEliminacion() === 'hard') {
        this.propiedadesService.eliminarPropiedadDefinitiva(id);
      } else {
        this.propiedadesService.cambiarEstadoPropiedad(id, 'Eliminada');
      }
      this.cargarPerfil(this.arrendador()!.id);
    }
    this.cancelarEliminacion();
  }

  cancelarEliminacion(): void {
    this.propiedadAEliminar.set(null);
  }
}

