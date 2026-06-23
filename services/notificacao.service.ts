import { Injectable } from '@angular/core';
import { CompraService } from './compra.service';
import { AlertaService } from './alerta.service';
import { AuthService } from './auth.service';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private apiUrl = 'https://api-odininvest.odiloncorrea.com';
  private eventSource?: EventSource;

  constructor(
    private compraService: CompraService,
    private alertaService: AlertaService,
    private authService: AuthService,
    private toastController: ToastController,
  ) {}

  /**
   * Abre a conexão SSE para receber notificações de alerta (RF-08).
   *
   * IMPORTANTE: o EventSource nativo do navegador NÃO permite enviar
   * headers customizados (como Authorization). Por isso o token é
   * enviado via query string (?token=...), formato comumente aceito
   * por endpoints SSE protegidos.
   *
   * Caso a API não aceite o token via query string, será necessário
   * usar a biblioteca 'event-source-polyfill' (npm install event-source-polyfill),
   * que permite enviar headers customizados em conexões SSE.
   */
  iniciarConexaoSSE(usuarioId: string): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    const token = this.authService.getToken();

    const url = token
      ? `${this.apiUrl}/notificacoes/usuario/${usuarioId}?token=${encodeURIComponent(token)}`
      : `${this.apiUrl}/notificacoes/usuario/${usuarioId}`;

    console.log('Abrindo SSE em:', url);

    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('✅ SSE conectado com sucesso!');
    };

    // Captura eventos nomeados
    this.eventSource.addEventListener('alerta-valor', (event: MessageEvent) => {
      console.log('📩 Evento alerta-valor recebido:', event.data);

      const dados = JSON.parse(event.data);
      this.processarNotificacao(dados, usuarioId);
    });

    // Captura eventos genéricos
    this.eventSource.onmessage = (event: MessageEvent) => {
      console.log('📨 Mensagem genérica recebida:', event.data);

      try {
        const dados = JSON.parse(event.data);
        this.processarNotificacao(dados, usuarioId);
      } catch {
        console.warn('Mensagem SSE não é JSON');
      }
    };

    this.eventSource.onerror = (err) => {
      console.error('❌ Erro na conexão SSE:', err);
    };
  }

  private async processarNotificacao(
    dados: any,
    usuarioId: string,
  ): Promise<void> {
    console.log('Processando notificação...');
    console.log('Usuário:', usuarioId);
    console.log('Dados recebidos:', dados);

    await this.mostrarToast(`🔔 ${dados.mensagem}`);
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('OdinInvest', {
          body: dados.mensagem,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('OdinInvest', {
              body: dados.mensagem,
            });
          }
        });
      }
    }

    if (dados.tipo === 'ACAO' && dados.acaoId) {
      console.log('Buscando alertas do usuário...');

      this.alertaService
        .listarAlertasPorUsuario(usuarioId)
        .subscribe((alertas: any[]) => {
          console.log('📋 Alertas carregados:', alertas);
          console.log('📩 Dados recebidos SSE:', dados);

          const alerta = alertas.find(
            (a) =>
              a.ativo === true &&
              a.acaoId === dados.acaoId &&
              Number(a.valor) === Number(dados.valorAlerta),
          );

          console.log('🎯 Alerta encontrado:', alerta);

          if (alerta && alerta.ativo) {
            // desativa primeiro
            alerta.ativo = false;

            this.alertaService.alterar(alerta.id, alerta).subscribe({
              next: () => {
                console.log('✅ Alerta desativado antes da compra');
                this.alertaService.notificarAtualizacao();

                this.compraService
                  .realizarCompra({
                    acaoId: dados.acaoId,
                    quantidade: Number(alerta.quantidade),
                    valor: Number(dados.valorAtual),
                    usuarioId: usuarioId,
                  })
                  .subscribe({
                    next: () => {
                      console.log('✅ Compra automática realizada');

                      this.mostrarToast(
                        `Compra automática de ${dados.nome} realizada!`,
                      );
                    },
                    error: (err) => {
                      console.error('❌ Erro na compra automática:', err);
                      console.log('📦 Payload enviado:', {
                        acaoId: dados.acaoId,
                        quantidade: Number(alerta.quantidade),
                        valor: Number(dados.valorAtual),
                        usuarioId: usuarioId,
                      });
                      console.log('📄 Body retornado:', err.error);
                    },
                  });
              },
              error: (err) => {
                console.error('❌ Erro ao desativar alerta:', err);
              },
            });
          } else {
            console.warn('⚠ Nenhum alerta ativo encontrado para essa ação.');
          }
        });
    }
  }
  private async mostrarToast(mensagem: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 4000,
      position: 'top',
      color: 'warning',
    });
    await toast.present();
  }

  encerrarConexao(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }
  }
}
