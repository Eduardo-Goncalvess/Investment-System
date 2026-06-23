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
  IonBackButton,
  IonButtons,
  AlertController,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioModel } from '../../model/usuario.model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
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
export class CadastroPage {
  usuario: UsuarioModel = new UsuarioModel();

  constructor(
    private usuarioService: UsuarioService,
    private navController: NavController,
    private alertController: AlertController,
  ) {}

  salvar(): void {
    if (!this.usuario.nome || !this.usuario.login || !this.usuario.senha) {
      this.mostrarAlerta('Atenção', 'Preencha todos os campos.');
      return;
    }

      this.usuario.perfil = 'CLIENTE';

  console.log('ENVIANDO:', this.usuario);

    this.usuarioService.cadastrar(this.usuario).subscribe({
      next: () => {
        this.mostrarAlerta('Sucesso', 'Usuário cadastrado com sucesso!').then(
          () => {
            this.navController.navigateBack('/login');
          },
        );
      },
error: (err) => {
  console.log('ERRO CADASTRO:', err);
  console.log('BODY:', err.error);
  console.log('DETALHES:', err.error.errors);

  if (err.error.errors) {
    err.error.errors.forEach((e: any) => {
      console.log(`Campo: ${e.field} | Erro: ${e.message}`);
    });
  }

  const msg = err.status === 409
    ? 'Login já cadastrado. Escolha outro.'
    : 'Erro ao cadastrar. Tente novamente.';

  this.mostrarAlerta('Erro', msg);
}
    });
  }

  private async mostrarAlerta(
    cabecalho: string,
    mensagem: string,
  ): Promise<any> {
    const alert = await this.alertController.create({
      header: cabecalho,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
    return alert.onDidDismiss();
  }
}
