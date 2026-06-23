import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonBackButton,
  IonButtons,
  AlertController,
} from '@ionic/angular/standalone';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-meus-dados',
  templateUrl: './meus-dados.page.html',
  styleUrls: ['./meus-dados.page.scss'],
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
    IonBackButton,
    IonButtons,
  ],
})
export class MeusDadosPage implements OnInit {
  nome: string = '';
  login: string = '';
  novaSenha: string = '';
  usuarioId: string = '';

  private apiUrl = 'https://api-odininvest.odiloncorrea.com';

constructor(
  private http: HttpClient,
  private alertController: AlertController,
  private usuarioService: UsuarioService
) {}

  ngOnInit(): void {
    this.usuarioId = localStorage.getItem('usuarioId') || '';
    const token = localStorage.getItem('token') || '';

    console.log('usuarioId usado:', this.usuarioId);

    const headers = new HttpHeaders({
      Authorization: token,
    });

    this.http
      .get<any>(`${this.apiUrl}/usuarios/${this.usuarioId}`, {
        headers,
      })
      .subscribe({
        next: (usuario) => {
          console.log('Dados do usuário:', usuario);
          this.nome = usuario.nome ?? usuario.name ?? '';
          this.login = usuario.login ?? usuario.username ?? '';
        },
        error: (err) => {
          console.error('Erro ao buscar usuário:', err);
          this.mostrarAlerta(
            'Erro',
            `Não foi possível carregar os dados. Status: ${err.status}`,
          );
        },
      });
  }

  alterarSenha(): void {
  if (!this.novaSenha) {
    this.mostrarAlerta('Atenção', 'Informe a nova senha.');
    return;
  }

  this.http.patch(
    `${this.apiUrl}/usuarios/${this.usuarioId}/senha`,
    this.novaSenha,
    {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token') || '',
        'Content-Type': 'application/json'
      })
    }
  ).subscribe({
    next: () => {
      this.mostrarAlerta('Sucesso', 'Senha alterada com sucesso!');
      this.novaSenha = '';
    },
    error: (err) => {
      console.error('Erro completo:', err);
      console.error('Body do erro:', err.error);
      this.mostrarAlerta(
        'Erro',
        `Não foi possível alterar a senha. Status: ${err.status}`
      );
    }
  });
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
