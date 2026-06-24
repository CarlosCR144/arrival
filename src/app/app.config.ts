import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { StorageService } from './core/services/storage.service';
import { AuthService } from './core/services/auth.service';
import { PropiedadesService } from './core/services/propiedades.service';

function initializeApp(): () => Promise<void> {
  const storage = inject(StorageService);
  const auth = inject(AuthService);
  const propiedades = inject(PropiedadesService);

  return async () => {
    // 1. Initialize storage (load seed data if needed)
    await storage.init();
    // 2. Restore session
    auth.restoreSession();
    // 3. Load properties into signal
    propiedades.cargarPropiedades();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
    },
  ],
};
