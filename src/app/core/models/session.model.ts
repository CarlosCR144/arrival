import { FiltrosState } from './filtros.model';

export interface Session {
  usuarioActual: string | null;
  comparador: string[];
  filtrosActivos: FiltrosState;
}
