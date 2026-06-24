import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PropiedadesService } from '../../core/services/propiedades.service';
import { PrecioChilenoPipe } from '../../shared/pipes/precio-chileno.pipe';
import { TipoCalefaccion, ItemInventario } from '../../core/models/propiedad.model';

interface FormData {
  titulo: string;
  sector: string;
  direccionReferencial: string;
  precio: number;
  tipoContrato: string;
  disponibleDesde: string;
  habitaciones: number;
  banos: number;
  metrosCuadrados: number;
  calefaccion: TipoCalefaccion[];
  amoblado: boolean;
  aceptaMascotas: boolean;
  descripcion: string;
  inventario: ItemInventario[];
}

@Component({
  selector: 'app-publicar',
  standalone: true,
  imports: [FormsModule, PrecioChilenoPipe],
  templateUrl: './publicar.component.html',
  styleUrl: './publicar.component.scss',
})
export class PublicarComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly propiedadesService = inject(PropiedadesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly Math = Math;
  currentStep = signal(1);
  showSuccess = signal(false);
  step1Error = signal('');
  step2Error = signal('');
  editId = signal<string | null>(null);

  ngOnInit(): void {
    const editParam = this.route.snapshot.queryParamMap.get('edit');
    if (editParam) {
      const prop = this.propiedadesService.getPropiedadById(editParam);
      if (prop && prop.arrendadorId === this.auth.currentUser()?.id) {
        this.editId.set(prop.id);
        this.formData = {
          titulo: prop.titulo,
          sector: prop.sector,
          direccionReferencial: prop.direccionReferencial,
          precio: prop.precio,
          tipoContrato: prop.tipoContrato,
          disponibleDesde: prop.disponibleDesde,
          habitaciones: prop.habitaciones,
          banos: prop.banos,
          metrosCuadrados: prop.metrosCuadrados,
          calefaccion: [...prop.calefaccion],
          amoblado: prop.amoblado,
          aceptaMascotas: prop.aceptaMascotas,
          descripcion: prop.descripcion,
          inventario: JSON.parse(JSON.stringify(prop.inventario || []))
        };
      }
    }
  }

  readonly sectores = ['Isla Teja', 'Centro', 'Barrios Bajos', 'Las Ánimas', 'Huachocopihue', 'Miraflores', 'Torobayo', 'Collico'];
  readonly calefaccionOpciones: { value: TipoCalefaccion; label: string }[] = [
    { value: 'leña', label: 'Leña' },
    { value: 'pellet', label: 'Pellet' },
    { value: 'electrica', label: 'Eléctrica' },
    { value: 'gas', label: 'Gas' },
  ];
  readonly estadosInventario: ItemInventario['estado'][] = ['Bueno', 'Regular', 'Malo'];

  formData: FormData = {
    titulo: '',
    sector: 'Centro',
    direccionReferencial: '',
    precio: 300000,
    tipoContrato: 'anio_corrido',
    disponibleDesde: '',
    habitaciones: 1,
    banos: 1,
    metrosCuadrados: 40,
    calefaccion: [],
    amoblado: false,
    aceptaMascotas: false,
    descripcion: '',
    inventario: [],
  };

  // ---- Navigation with validation ----
  nextStep(): void {
    if (this.currentStep() === 1) {
      const err = this.validateStep1();
      if (err) { this.step1Error.set(err); return; }
      this.step1Error.set('');
    }
    if (this.currentStep() === 2) {
      const err = this.validateStep2();
      if (err) { this.step2Error.set(err); return; }
      this.step2Error.set('');
    }
    if (this.currentStep() < 3) this.currentStep.update(s => s + 1);
  }

  prevStep(): void {
    this.step1Error.set('');
    this.step2Error.set('');
    if (this.currentStep() > 1) this.currentStep.update(s => s - 1);
  }

  private validateStep1(): string {
    if (!this.formData.titulo.trim()) return 'El título de la publicación es obligatorio.';
    if (!this.formData.direccionReferencial.trim()) return 'La dirección referencial es obligatoria.';
    if (this.formData.precio < 50000) return 'El precio mensual debe ser mayor a $50.000.';
    if (!this.formData.disponibleDesde) return 'Debes indicar la fecha de disponibilidad.';
    return '';
  }

  private validateStep2(): string {
    if (this.formData.calefaccion.length === 0) return 'Selecciona al menos un tipo de calefacción.';
    return '';
  }

  // ---- Calefacción ----
  toggleCalefaccion(tipo: TipoCalefaccion): void {
    const idx = this.formData.calefaccion.indexOf(tipo);
    if (idx > -1) this.formData.calefaccion.splice(idx, 1);
    else this.formData.calefaccion.push(tipo);
  }

  isCalefaccionSelected(tipo: TipoCalefaccion): boolean {
    return this.formData.calefaccion.includes(tipo);
  }

  // ---- Inventario (items de muebles) ----
  agregarItemInventario(): void {
    this.formData.inventario.push({ item: '', estado: 'Bueno' });
  }

  quitarItemInventario(idx: number): void {
    this.formData.inventario.splice(idx, 1);
  }

  onToggleAmoblado(): void {
    this.formData.amoblado = !this.formData.amoblado;
    if (!this.formData.amoblado) {
      this.formData.inventario = [];
    }
  }

  // ---- Publicar ----
  publicar(): void {
    const user = this.auth.currentUser();
    if (!user) return;
    const isEdit = !!this.editId();
    if (isEdit) {
      this.propiedadesService.actualizarPropiedad(this.editId()!, {
        ...this.formData
      });
    } else {
      const id = 'p' + Date.now();
      this.propiedadesService.agregarPropiedad({
        ...this.formData,
        id,
        arrendadorId: user.id,
        imagenes: [
          `https://picsum.photos/seed/${id}/800/600`,
          `https://picsum.photos/seed/${id}a/800/600`,
          `https://picsum.photos/seed/${id}b/800/600`,
        ],
        nuevo: true,
        fechaPublicacion: new Date().toISOString().split('T')[0],
        coordenadas: { lat: -39.8142, lng: -73.2459 },
        resenas: [],
      });
    }
    this.showSuccess.set(true);
    setTimeout(() => this.router.navigate(['/arrendador', user.id]), 2500);
  }

  cancelar(): void {
    const user = this.auth.currentUser();
    if (this.editId() && user) {
      this.router.navigate(['/arrendador', user.id]);
    } else {
      this.router.navigate(['/']);
    }
  }

  getContratoLabel(tipo: string): string {
    return tipo === 'anio_corrido' ? 'Año corrido' : 'Marzo – Diciembre';
  }

  getCalefaccionLabels(): string {
    const labels: Record<string, string> = {
      'leña': 'Leña', pellet: 'Pellet', electrica: 'Eléctrica', gas: 'Gas',
    };
    return this.formData.calefaccion.map(c => labels[c] ?? c).join(', ') || 'No especificada';
  }

  get inventarioValido(): ItemInventario[] {
    return this.formData.inventario.filter(i => i.item.trim() !== '');
  }
}
