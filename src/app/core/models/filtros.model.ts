import { TipoCalefaccion } from './propiedad.model';

export interface FiltrosState {
  sector: string;
  precioMin: number;
  precioMax: number;
  tipoContrato: string;
  calefaccion: TipoCalefaccion[];
  amoblado: boolean | null;
  aceptaMascotas: boolean | null;
}

export const FILTROS_INITIAL: FiltrosState = {
  sector: 'todos',
  precioMin: 0,
  precioMax: 1000000,
  tipoContrato: 'todos',
  calefaccion: [],
  amoblado: null,
  aceptaMascotas: null,
};
