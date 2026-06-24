import { Usuario } from './usuario.model';
import { Propiedad } from './propiedad.model';
import { Chat } from './chat.model';
import { Session } from './session.model';

export interface ArrivalMeta {
  version: string;
  app: string;
}

export interface ArrivalData {
  meta: ArrivalMeta;
  users: Usuario[];
  propiedades: Propiedad[];
  chats: Chat[];
  session: Session;
}
