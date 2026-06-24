import { Injectable } from '@angular/core';
import { ArrivalData } from '../models/arrival-data.model';

const STORAGE_KEY = 'arrival_data';

@Injectable({ providedIn: 'root' })
export class StorageService {

  getData(): ArrivalData {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  setData(data: ArrivalData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async init(): Promise<void> {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const response = await fetch('assets/data/arrival_data.json');
      const rawData = await response.json();
      // Normalize field names from JSON (which uses Spanish characters)
      const normalized = this.normalizeData(rawData);
      this.setData(normalized);
    }
  }

  /** Maps accented field names from the seed JSON to ASCII names used in the TypeScript model */
  private normalizeData(raw: any): ArrivalData {
    if (!raw) return raw;

    const propiedades = (raw.propiedades ?? []).map((p: any) => ({
      ...p,
      banos: p['ba\u00F1os'] ?? p.banos ?? 0,
      resenas: p['rese\u00F1asArrendatarios'] ?? p['rese\u00F1as'] ?? p.resenas ?? [],
      tipoContrato: (p.tipoContrato === 'a\u00F1o_corrido') ? 'anio_corrido' : (p.tipoContrato ?? 'anio_corrido'),
    }));

    const users = (raw.users ?? []).map((u: any) => ({
      ...u,
      totalResenias: u['totalRese\u00F1as'] ?? u.totalResenias ?? 0,
    }));

    return { ...raw, propiedades, users };
  }
}
