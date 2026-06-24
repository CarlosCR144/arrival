export type TipoCalefaccion = 'leña' | 'pellet' | 'electrica' | 'gas';
export type TipoContrato = 'anio_corrido' | 'marzo_diciembre';
export type EstadoInventario = 'Bueno' | 'Regular' | 'Malo';

export interface ItemInventario {
  item: string;
  estado: EstadoInventario;
}

export interface ResenaArrendatario {
  autor: string;
  rating: number;
  comentario: string;
  fecha: string;
}

export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface Propiedad {
  id: string;
  titulo: string;
  sector: string;
  direccionReferencial: string;
  precio: number;
  tipoContrato: string;
  disponibleDesde: string;
  calefaccion: TipoCalefaccion[];
  habitaciones: number;
  banos: number;
  metrosCuadrados: number;
  amoblado: boolean;
  aceptaMascotas: boolean;
  arrendadorId: string;
  descripcion: string;
  imagenes: string[];
  inventario: ItemInventario[];
  nuevo: boolean;
  fechaPublicacion: string;
  coordenadas: Coordenadas;
  resenas: ResenaArrendatario[];
  estado?: 'Activa' | 'Oculta' | 'Eliminada';
}
