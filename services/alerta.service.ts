import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertaModel } from '../model/alerta.model';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private apiUrl = 'https://api-odininvest.odiloncorrea.com';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}
  private alertaAtualizado = new BehaviorSubject<void>(undefined);

  alertaAtualizado$ = this.alertaAtualizado.asObservable();

  notificarAtualizacao() {
    this.alertaAtualizado.next();
  }

  listarAlertasPorUsuario(usuarioId: string): Observable<any> {
    return this.http.get<any[]>(
      `${this.apiUrl}/alertas-acoes/usuario/${usuarioId}`,
      {
        headers: this.auth.getAuthHeaders(),
      },
    );
  }

  buscarPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/alertas-acoes/${id}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  cadastrar(alerta: AlertaModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/alertas-acoes`, alerta, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  alterar(id: string, alerta: AlertaModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/alertas-acoes/${id}`, alerta, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  excluir(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/alertas-acoes/${id}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  salvar(alerta: AlertaModel): Observable<any> {
    if (alerta.id) {
      return this.alterar(alerta.id, alerta);
    }
    return this.cadastrar(alerta);
  }
}
