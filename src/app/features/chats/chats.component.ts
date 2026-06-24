import { Component, inject, OnInit, signal, computed, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { PropiedadesService } from '../../core/services/propiedades.service';
import { Chat } from '../../core/models/chat.model';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit, AfterViewChecked {
  private readonly chatService = inject(ChatService);
  private readonly auth = inject(AuthService);
  private readonly storage = inject(StorageService);
  private readonly propiedadesService = inject(PropiedadesService);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLElement>;

  chats = signal<Chat[]>([]);
  chatActivo = signal<Chat | null>(null);
  nuevoMensaje = '';
  showConversation = signal(false); // For mobile: show right panel
  private shouldScrollToBottom = false;

  currentUserId = computed(() => this.auth.currentUser()?.id ?? '');

  ngOnInit(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;
    this.recargarChats();
    const chatId = this.route.snapshot.paramMap.get('id');
    if (chatId) {
      const chat = this.chatService.getChatById(chatId);
      if (chat) { this.chatActivo.set(chat); this.showConversation.set(true); }
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  recargarChats(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;
    this.chats.set(this.chatService.getChatsByUser(userId));
  }

  seleccionarChat(chatId: string): void {
    const chat = this.chatService.getChatById(chatId);
    if (chat) {
      this.chatActivo.set(chat);
      this.showConversation.set(true);
      this.shouldScrollToBottom = true;
    }
  }

  volverALista(): void {
    this.showConversation.set(false);
  }

  enviarMensaje(): void {
    const texto = this.nuevoMensaje.trim();
    const chatId = this.chatActivo()?.id;
    const userId = this.auth.currentUser()?.id;
    if (!texto || !chatId || !userId) return;
    this.chatService.enviarMensaje(chatId, userId, texto);
    this.nuevoMensaje = '';
    this.recargarChats();
    const updatedChat = this.chatService.getChatById(chatId);
    if (updatedChat) this.chatActivo.set(updatedChat);
    this.shouldScrollToBottom = true;
  }

  private scrollToBottom(): void {
    const el = this.messagesContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  private getOtroUsuario(chat: Chat): Usuario | undefined {
    const myId = this.auth.currentUser()?.id;
    const otherId = chat.participantes.find(p => p !== myId);
    return this.storage.getData().users.find(u => u.id === otherId);
  }

  getOtroParticipanteNombre(chat: Chat): string {
    return this.getOtroUsuario(chat)?.nombre ?? 'Usuario';
  }

  getOtroParticipanteAvatar(chat: Chat): string {
    return this.getOtroUsuario(chat)?.avatar ?? 'https://i.pravatar.cc/150?u=default';
  }

  getPropiedad(chat: Chat) {
    return this.propiedadesService.getPropiedadById(chat.propiedadId) ?? null;
  }

  getPropiedadTitulo(chat: Chat): string {
    const prop = this.getPropiedad(chat);
    return prop ? prop.titulo : 'Propiedad Eliminada';
  }

  getUltimoMensaje(chat: Chat): string {
    const last = chat.mensajes[chat.mensajes.length - 1];
    if (!last) return 'Sin mensajes';
    return last.texto.length > 50 ? last.texto.substring(0, 47) + '...' : last.texto;
  }

  getTimestamp(chat: Chat): string {
    const date = new Date(chat.ultimaActividad);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);
    if (diffH < 1) return 'Ahora';
    if (diffH < 24) return `Hace ${diffH}h`;
    if (diffD === 1) return 'Ayer';
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  }
}
