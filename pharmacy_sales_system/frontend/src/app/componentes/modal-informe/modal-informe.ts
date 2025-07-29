import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-modal-informe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-informe.html',
})
export class ModalInforme {
  periodo: 'dia' | 'semana' | 'mes' = 'dia';
  destinatario: string = '';
  isLoading: boolean = false;
  mensaje: { texto: string, tipo: string } = { texto: '', tipo: '' };

  constructor(private api: Api) {}

  enviarInforme(): void {
    if (!this.destinatario) {
      this.mostrarMensaje('Por favor, ingrese un correo electrónico.', 'danger');
      return;
    }
    this.isLoading = true;
    this.mensaje.texto = '';
    const body = { periodo: this.periodo, destinatario: this.destinatario };

    this.api.post('/informes/enviar/', body).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.mostrarMensaje(res.message, 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.mostrarMensaje(err.error?.error || 'Ocurrió un error inesperado al enviar el correo.', 'danger');
      }
    });
  }

  mostrarMensaje(texto: string, tipo: 'success' | 'danger'): void {
    this.mensaje = { texto, tipo };
    setTimeout(() => {
      this.mensaje.texto = '';
    }, 5000);
  }
}