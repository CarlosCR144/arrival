export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: 'arrendatario' | 'arrendador';
  avatar: string;
  telefono?: string;
  verificado: boolean;
  fechaRegistro: string;
  descripcion?: string;
  rating?: number;
  totalResenias?: number;
  propiedades?: string[];
  favoritos?: string[];
  chats: string[];
}
