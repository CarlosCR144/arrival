import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/explorar/explorar.component').then(m => m.ExplorarComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'propiedad/:id',
    loadComponent: () => import('./features/detalle/detalle.component').then(m => m.DetalleComponent),
  },
  {
    path: 'comparar',
    loadComponent: () => import('./features/comparador/comparador.component').then(m => m.ComparadorComponent),
  },
  {
    path: 'arrendador/:id',
    loadComponent: () => import('./features/perfil-arrendador/perfil-arrendador.component').then(m => m.PerfilArrendadorComponent),
  },
  {
    path: 'publicar',
    canActivate: [authGuard(['arrendador'])],
    loadComponent: () => import('./features/publicar/publicar.component').then(m => m.PublicarComponent),
  },
  {
    path: 'favoritos',
    canActivate: [authGuard(['arrendatario'])],
    loadComponent: () => import('./features/favoritos/favoritos.component').then(m => m.FavoritosComponent),
  },
  {
    path: 'chats',
    canActivate: [authGuard()],
    loadComponent: () => import('./features/chats/chats.component').then(m => m.ChatsComponent),
  },
  {
    path: 'chats/:id',
    canActivate: [authGuard()],
    loadComponent: () => import('./features/chats/chats.component').then(m => m.ChatsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
