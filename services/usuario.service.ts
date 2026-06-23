import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../model/usuario.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'https://api-odininvest.odiloncorrea.com';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  login(login: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { login, senha });
  }

  cadastrar(usuario: UsuarioModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, usuario);
  }

  buscarPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

alterarSenha(id: string, novaSenha: string): Observable<any> {
  return this.http.patch(
    `${this.apiUrl}/usuarios/${id}/senha`,
    novaSenha,
    { headers: this.auth.getAuthHeaders() }
  );
}
}
