import { Injectable, signal, inject } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);

  currentUser = signal<Usuario | null>(null);

  login(email: string, password: string): boolean {
    const data = this.storage.getData();
    const user = data.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser.set(user);
      data.session.usuarioActual = user.id;
      this.storage.setData(data);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    const data = this.storage.getData();
    data.session.usuarioActual = null;
    this.storage.setData(data);
  }

  register(userData: { nombre: string; email: string; password: string; rol: 'arrendatario' | 'arrendador' }): boolean {
    const data = this.storage.getData();
    // Verificar si el email ya existe
    if (data.users.find(u => u.email === userData.email)) {
      return false;
    }
    const newUser: Usuario = {
      id: 'u' + Date.now(),
      nombre: userData.nombre,
      email: userData.email,
      password: userData.password,
      rol: userData.rol,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      verificado: false,
      fechaRegistro: new Date().toISOString().split('T')[0],
      chats: [],
      ...(userData.rol === 'arrendatario' ? { favoritos: [] } : { propiedades: [], descripcion: '', rating: 0, totalResenias: 0 }),
    };
    data.users.push(newUser);
    data.session.usuarioActual = newUser.id;
    this.storage.setData(data);
    this.currentUser.set(newUser);
    return true;
  }

  restoreSession(): void {
    const data = this.storage.getData();
    if (data?.session?.usuarioActual) {
      const user = data.users.find(u => u.id === data.session.usuarioActual);
      if (user) {
        this.currentUser.set(user);
      }
    }
  }

  // Helper para refrescar el usuario actual desde storage (después de cambios externos como favoritos)
  refreshCurrentUser(): void {
    const data = this.storage.getData();
    const userId = this.currentUser()?.id;
    if (userId) {
      const user = data.users.find(u => u.id === userId);
      if (user) {
        this.currentUser.set(user);
      }
    }
  }
}
