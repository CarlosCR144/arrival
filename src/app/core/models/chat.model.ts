export interface Mensaje {
  id: string;
  autorId: string;
  texto: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participantes: string[];
  propiedadId: string;
  mensajes: Mensaje[];
  ultimaActividad: string;
}
