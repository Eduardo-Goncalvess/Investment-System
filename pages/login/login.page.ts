import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonImg,
  AlertController,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { NotificacaoService } from '../../services/notificacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
  ],
})
export class LoginPage {
  login: string = '';
  senha: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private navController: NavController,
    private alertController: AlertController,
    private notificacaoService: NotificacaoService,
  ) {}

  entrar(): void {
    if (!this.login || !this.senha) {
      this.mostrarAlerta('Atenção', 'Informe login e senha.');
      return;
    }

    this.usuarioService.login(this.login, this.senha).subscribe({
      next: (res) => {
        // A API pode retornar o token em campos diferentes
        const token = res.token ?? res.accessToken ?? res.access_token ?? res.jwt ?? '';

        if (!token) {
          this.mostrarAlerta('Erro', 'Token não recebido. Verifique o console.');
          return;
        }

        // Salva token + usuarioId de forma centralizada e consistente
        const usuarioId = this.authService.salvarSessao(token);
        console.log('usuarioId salvo:', usuarioId);
        this.navController.navigateRoot('/menu');
      },
      error: () => {
        this.mostrarAlerta('Erro', 'Login ou senha inválidos.');
      },
    });
  }

  irCadastro(): void {
    this.navController.navigateForward('/cadastro');
  }

  private async mostrarAlerta(
    cabecalho: string,
    mensagem: string,
  ): Promise<void> {
    const alert = await this.alertController.create({
      header: cabecalho,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }
}