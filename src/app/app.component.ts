import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { ComparadorFabComponent } from './shared/components/comparador-fab/comparador-fab.component';

const DISCLAIMER_KEY = 'arrival_disclaimer_accepted';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ComparadorFabComponent],
  template: `
    <!-- Modal de aviso académico (solo primera vez) -->
    @if (showDisclaimer()) {
      <div class="disclaimer-overlay">
        <div class="disclaimer-modal" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title">
          <div class="disclaimer-modal__header">
            <span class="material-symbols-outlined disclaimer-modal__icon">school</span>
            <h2 id="disclaimer-title" class="disclaimer-modal__title">Sitio web de uso académico</h2>
          </div>
          <div class="disclaimer-modal__body">
            <p class="disclaimer-modal__lead">
              Bienvenido/a a <strong>Arrival</strong>, un prototipo funcional desarrollado en el marco de la
              asignatura <strong>Innovación y Emprendimiento II</strong> de INACAP Sede Valdivia.
            </p>
            <div class="disclaimer-modal__alerts">
              <div class="disclaimer-modal__alert disclaimer-modal__alert--info">
                <span class="material-symbols-outlined">info</span>
                <p>Este sitio constituye un <strong>prototipo académico referencial</strong> y no representa un producto comercial, servicio real ni la versión final de ningún sistema. Los contenidos, precios y propiedades mostrados son ficticios y han sido generados con fines ilustrativos.</p>
              </div>
              <div class="disclaimer-modal__alert disclaimer-modal__alert--warning">
                <span class="material-symbols-outlined">storage</span>
                <p>Toda la información ingresada en el sitio se almacena <strong>exclusivamente de forma local en el navegador</strong> (localStorage) y no es transmitida a ningún servidor externo. Sin embargo, se recomienda evitar el uso de <strong>contraseñas reales, datos personales sensibles o información privada</strong> en los formularios.</p>
              </div>
              <div class="disclaimer-modal__alert disclaimer-modal__alert--neutral">
                <span class="material-symbols-outlined">photo_library</span>
                <p>Las imágenes de propiedades son generadas automáticamente mediante el servicio externo <strong>picsum.photos</strong> con fines demostrativos únicamente.</p>
              </div>
            </div>
          </div>
          <div class="disclaimer-modal__footer">
            <label class="disclaimer-modal__checkbox-label">
              <input type="checkbox" id="disclaimer-check" (change)="onCheckChange($event)" class="disclaimer-modal__checkbox">
              <span>Acepto haber leído y comprendido la información descrita respecto al carácter académico de este sitio web.</span>
            </label>
            <button class="disclaimer-modal__btn"
                    [disabled]="!disclaimerChecked()"
                    (click)="acceptDisclaimer()">
              <span class="material-symbols-outlined">check_circle</span>
              Acepto y continuar
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Banner prototipo -->
    <div class="prototype-banner" role="note">
      <span class="material-symbols-outlined prototype-banner__icon">science</span>
      <span>Prototipo académico · Innovación y Emprendimiento II · INACAP Valdivia · Los datos y propiedades mostrados son ficticios.</span>
    </div>

    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-comparador-fab></app-comparador-fab>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* ===== BANNER PROTOTIPO ===== */
    .prototype-banner {
      background: var(--primary);
      color: var(--on-primary);
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 6px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-align: center;
      flex-shrink: 0;

      &__icon {
        font-size: 14px;
        opacity: 0.85;
        flex-shrink: 0;
      }
    }

    /* ===== OVERLAY DEL MODAL ===== */
    .disclaimer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 20, 18, 0.72);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 1rem;
      animation: fadeIn 0.3s ease;
    }

    /* ===== MODAL ===== */
    .disclaimer-modal {
      background: #ffffff;
      border-radius: 20px;
      max-width: 620px;
      width: 100%;
      box-shadow: 0 24px 80px rgba(0, 40, 36, 0.28);
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

      &__header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 2rem 2rem 1.25rem;
        text-align: center;
        border-bottom: 1px solid #e5e7e7;
      }

      &__icon {
        font-size: 48px;
        color: #00685d;
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
      }

      &__title {
        font-size: 22px;
        font-weight: 700;
        color: #191c1d;
        letter-spacing: -0.01em;
      }

      &__body {
        padding: 1.5rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      &__lead {
        font-size: 15px;
        line-height: 1.65;
        color: #3d4946;
      }

      &__alerts {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      &__alert {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        border-radius: 10px;
        font-size: 13.5px;
        line-height: 1.6;

        .material-symbols-outlined {
          font-size: 20px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        p { margin: 0; }

        &--info {
          background: rgba(0, 104, 93, 0.07);
          color: #1a4340;
          border-left: 3px solid #00685d;
          .material-symbols-outlined { color: #00685d; }
        }

        &--warning {
          background: rgba(234, 179, 8, 0.08);
          color: #713f12;
          border-left: 3px solid #ca8a04;
          .material-symbols-outlined { color: #ca8a04; }
        }

        &--neutral {
          background: rgba(100, 116, 139, 0.07);
          color: #374151;
          border-left: 3px solid #94a3b8;
          .material-symbols-outlined { color: #64748b; }
        }
      }

      &__footer {
        padding: 1.25rem 2rem 2rem;
        border-top: 1px solid #e5e7e7;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      &__checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        font-size: 13.5px;
        font-weight: 500;
        color: #191c1d;
        cursor: pointer;
        line-height: 1.5;
      }

      &__checkbox {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        margin-top: 1px;
        accent-color: #00685d;
        cursor: pointer;
      }

      &__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.875rem;
        background: #00685d;
        color: #ffffff;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.2s;

        .material-symbols-outlined { font-size: 20px; }

        &:hover:not(:disabled) {
          background: #005048;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0, 104, 93, 0.3);
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(32px) scale(0.97); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
  `],
})
export class AppComponent implements OnInit {
  showDisclaimer = signal(false);
  disclaimerChecked = signal(false);

  ngOnInit(): void {
    const accepted = localStorage.getItem(DISCLAIMER_KEY);
    if (!accepted) {
      this.showDisclaimer.set(true);
    }
  }

  onCheckChange(event: Event): void {
    this.disclaimerChecked.set((event.target as HTMLInputElement).checked);
  }

  acceptDisclaimer(): void {
    if (!this.disclaimerChecked()) return;
    localStorage.setItem(DISCLAIMER_KEY, 'true');
    this.showDisclaimer.set(false);
  }
}
