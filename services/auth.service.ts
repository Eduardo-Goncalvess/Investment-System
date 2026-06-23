import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

const API_URL = 'https://api-odininvest.odiloncorrea.com';
const TOKEN_KEY = 'token';
const USUARIO_ID_KEY = 'usuarioId';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Salva o token e extrai o usuarioId do payload JWT, de forma centralizada */
  salvarSessao(token: string): string {
    localStorage.setItem(TOKEN_KEY, token);

    let usuarioId = '';
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/'),
      );
      const payload = JSON.parse(payloadJson);

      // LOG TEMPORÁRIO DE DIAGNÓSTICO — remover depois de identificar o campo correto
      console.log('🔍 PAYLOAD COMPLETO DO TOKEN:', payload);
      console.log('🔍 Campos disponíveis:', Object.keys(payload));

      usuarioId =
        payload.sub ??
        payload.id ??
        payload.usuarioId ??
        payload.usuario_id ??
        payload.userId ??
        '';
    } catch (e) {
      console.error('Erro ao decodificar JWT', e);
    }

    localStorage.setItem(USUARIO_ID_KEY, String(usuarioId));
    return usuarioId;
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUsuarioId(): string | null {
    return localStorage.getItem(USUARIO_ID_KEY);
  }

  /**
   * Monta o header Authorization de forma segura.
   * Se não houver token salvo, retorna headers vazios em vez de "Bearer null".
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();

    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders()
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
  }

  isAutenticado(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
  }

  getApiUrl(): string {
    return API_URL;
  }
}
