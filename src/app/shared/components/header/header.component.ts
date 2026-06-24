import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PropiedadesService } from '../../../core/services/propiedades.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly propiedadesService = inject(PropiedadesService);

  showUserMenu = signal(false);
  showMobileMenu = signal(false);

  isArrendatario(): boolean {
    return this.auth.currentUser()?.rol === 'arrendatario';
  }

  get displayNombre(): string {
    const user = this.auth.currentUser();
    if (!user) return '';
    const name = user.nombre.split(' ')[0];
    return name.length > 12 ? name.substring(0, 12) + '...' : name;
  }

  toggleMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.update(v => !v);
  }

  closeMobileMenu(): void {
    this.showMobileMenu.set(false);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.propiedadesService.busqueda.set(input.value);
  }

  limpiarBusqueda(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.propiedadesService.busqueda.set('');
  }

  logout(): void {
    this.auth.logout();
    this.showUserMenu.set(false);
    this.showMobileMenu.set(false);
    this.router.navigate(['/']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.showUserMenu.set(false);
    this.showMobileMenu.set(false);
  }
}
