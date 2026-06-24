import { Injectable, inject } from '@angular/core';
import { Chat, Mensaje } from '../models/chat.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private storage = inject(StorageService);

  getChatsByUser(userId: string): Chat[] {
    const data = this.storage.getData();
    return data.chats.filter(c => c.participantes.includes(userId));
  }

  getChatById(chatId: string): Chat | undefined {
    const data = this.storage.getData();
    return data.chats.find(c => c.id === chatId);
  }

  getOrCreateChat(arrendatarioId: string, arrendadorId: string, propiedadId: string): string {
    const data = this.storage.getData();

    // Buscar chat existente con los mismos participantes y propiedad
    const existing = data.chats.find(c =>
      c.propiedadId === propiedadId &&
      c.participantes.includes(arrendatarioId) &&
      c.participantes.includes(arrendadorId)
    );

    if (existing) return existing.id;

    // Crear nuevo chat
    const newChat: Chat = {
      id: 'c' + Date.now(),
      participantes: [arrendatarioId, arrendadorId],
      propiedadId,
      mensajes: [],
      ultimaActividad: new Date().toISOString(),
    };

    data.chats.push(newChat);

    // Agregar ID del chat a ambos usuarios
    const user1 = data.users.find(u => u.id === arrendatarioId);
    const user2 = data.users.find(u => u.id === arrendadorId);
    if (user1) user1.chats.push(newChat.id);
    if (user2) user2.chats.push(newChat.id);

    this.storage.setData(data);
    return newChat.id;
  }

  enviarMensaje(chatId: string, autorId: string, texto: string): void {
    const data = this.storage.getData();
    const chat = data.chats.find(c => c.id === chatId);
    if (!chat) return;

    const mensaje: Mensaje = {
      id: 'm' + Date.now(),
      autorId,
      texto,
      timestamp: new Date().toISOString(),
    };

    chat.mensajes.push(mensaje);
    chat.ultimaActividad = mensaje.timestamp;
    this.storage.setData(data);
  }
}
