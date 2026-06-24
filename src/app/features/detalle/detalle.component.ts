import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PropiedadesService } from '../../core/services/propiedades.service';
import { AuthService } from '../../core/services/auth.service';
import { ChatService } from '../../core/services/chat.service';
import { StorageService } from '../../core/services/storage.service';
import { PrecioChilenoPipe } from '../../shared/pipes/precio-chileno.pipe';
import { Propiedad } from '../../core/models/propiedad.model';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [RouterLink, PrecioChilenoPipe],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss',
})
export class DetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly propiedadesService = inject(PropiedadesService);
  readonly auth = inject(AuthService);
  private readonly chatService = inject(ChatService);
  private readonly storage = inject(StorageService);

  propiedad = signal<Propiedad | null>(null);
  arrendador = signal<Usuario | null>(null);
  imagenActual = signal(0);

  esFavorito = computed(() => {
    const user = this.auth.currentUser();
    const prop = this.propiedad();
    if (!user || user.rol !== 'arrendatario' || !prop) return false;
    return user.favoritos?.includes(prop.id) ?? false;
  });

  disponibilidadEsAhora = computed(() => {
    const prop = this.propiedad();
    if (!prop) return false;
    return new Date(prop.disponibleDesde) <= new Date();
  });

  disponibilidadTexto = computed(() => {
    const prop = this.propiedad();
    if (!prop) return '';
    if (this.disponibilidadEsAhora()) return 'Disponible ahora';
    const d = new Date(prop.disponibleDesde);
    return `Disponible desde ${d.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}`;
  });

  mapUrl = computed((): SafeResourceUrl => {
    const prop = this.propiedad();
    if (!prop) return '';
    const url = `https://maps.google.com/maps?q=${prop.coordenadas.lat},${prop.coordenadas.lng}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  starsArray = [1, 2, 3, 4, 5];

  esPropietario = computed(() => {
    return this.auth.currentUser()?.id === this.propiedad()?.arrendadorId;
  });

  propiedadAEliminar = signal<string | null>(null);
  tipoEliminacion = signal<'soft' | 'hard'>('soft');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/']); return; }
    
    this.cargarPropiedad(id);
  }

  cargarPropiedad(id: string): void {
    const prop = this.propiedadesService.getPropiedadById(id);
    if (!prop) { this.router.navigate(['/']); return; }
    
    const user = this.auth.currentUser();
    if (prop.estado === 'Eliminada' && user?.id !== prop.arrendadorId) {
      this.router.navigate(['/']);
      return;
    }

    this.propiedad.set(prop);
    const data = this.storage.getData();
    const arrendador = data.users.find(u => u.id === prop.arrendadorId) ?? null;
    this.arrendador.set(arrendador);
  }

  editarPropiedad(): void {
    const prop = this.propiedad();
    if (prop) this.router.navigate(['/publicar'], { queryParams: { edit: prop.id } });
  }

  toggleVisibilidad(): void {
    const prop = this.propiedad();
    if (!prop) return;
    const nuevoEstado = prop.estado === 'Oculta' ? 'Activa' : 'Oculta';
    this.propiedadesService.cambiarEstadoPropiedad(prop.id, nuevoEstado);
    this.cargarPropiedad(prop.id);
  }

  restaurarPropiedad(): void {
    const prop = this.propiedad();
    if (!prop) return;
    this.propiedadesService.cambiarEstadoPropiedad(prop.id, 'Activa');
    this.cargarPropiedad(prop.id);
  }

  iniciarEliminacion(tipo: 'soft' | 'hard'): void {
    const prop = this.propiedad();
    if (prop) {
      this.propiedadAEliminar.set(prop.id);
      this.tipoEliminacion.set(tipo);
    }
  }

  confirmarEliminacion(): void {
    const id = this.propiedadAEliminar();
    if (id) {
      if (this.tipoEliminacion() === 'hard') {
        this.propiedadesService.eliminarPropiedadDefinitiva(id);
        this.router.navigate(['/arrendador', this.auth.currentUser()?.id]);
      } else {
        this.propiedadesService.cambiarEstadoPropiedad(id, 'Eliminada');
        this.cargarPropiedad(id);
      }
    }
    this.cancelarEliminacion();
  }

  cancelarEliminacion(): void {
    this.propiedadAEliminar.set(null);
  }

  siguienteImagen(): void {
    const imgs = this.propiedad()?.imagenes ?? [];
    this.imagenActual.update(i => (i + 1) % imgs.length);
  }

  anteriorImagen(): void {
    const imgs = this.propiedad()?.imagenes ?? [];
    this.imagenActual.update(i => (i - 1 + imgs.length) % imgs.length);
  }

  seleccionarImagen(i: number): void {
    this.imagenActual.set(i);
  }

  contactarArrendador(): void {
    const prop = this.propiedad();
    if (!prop) return;
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/propiedad/${prop.id}` } });
      return;
    }
    const chatId = this.chatService.getOrCreateChat(user.id, prop.arrendadorId, prop.id);
    this.router.navigate(['/chats', chatId]);
  }

  toggleFavorito(): void {
    const user = this.auth.currentUser();
    const prop = this.propiedad();
    if (!user || !prop || user.rol !== 'arrendatario') return;
    const data = this.storage.getData();
    const userInData = data.users.find(u => u.id === user.id);
    if (!userInData) return;
    if (!userInData.favoritos) userInData.favoritos = [];
    const idx = userInData.favoritos.indexOf(prop.id);
    if (idx > -1) userInData.favoritos.splice(idx, 1);
    else userInData.favoritos.push(prop.id);
    this.storage.setData(data);
    this.auth.refreshCurrentUser();
  }

  getEstadoClass(estado: string): string {
    return { Bueno: 'estado--bueno', Regular: 'estado--regular', Malo: 'estado--malo' }[estado] ?? '';
  }

  getCalefaccionLabel(tipo: string): string {
    const labels: Record<string, string> = { pellet: 'Pellet', 'le\u00F1a': 'Leña', electrica: 'Eléctrica', gas: 'Gas' };
    return labels[tipo] ?? tipo;
  }

  getTipoContratoLabel(tipo: string): string {
    return tipo === 'anio_corrido' ? 'Año corrido' : 'Mar – Dic';
  }
}
