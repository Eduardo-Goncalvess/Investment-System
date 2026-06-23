import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AcaoService {
  private apiUrl = 'https://api-odininvest.odiloncorrea.com';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  listarAcoes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/acoes`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  buscarPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/acoes/${id}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
