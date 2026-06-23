import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraModel } from '../model/compra.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private apiUrl = 'https://api-odininvest.odiloncorrea.com';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  listarComprasPorUsuario(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/compras-acoes/usuario/${usuarioId}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  realizarCompra(compra: CompraModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/compras-acoes`, compra, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  consultarCarteira(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/carteira-acoes/usuario/${usuarioId}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
