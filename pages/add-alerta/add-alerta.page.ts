import { Component, OnInit } from '@angular/core';
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
  IonSelect,
  IonSelectOption,
  IonToggle,
  AlertController,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AcaoService } from '../../services/acao.service';
import { AlertaService } from '../../services/alerta.service';
import { AuthService } from '../../services/auth.service';
import { AlertaModel } from '../../model/alerta.model';

@Component({
  selector: 'app-add-alerta',
  templateUrl: './add-alerta.page.html',
  styleUrls: ['./add-alerta.page.scss'],
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
    IonSelect,
    IonSelectOption,
  ],
})
export class AddAlertaPage implements OnInit {
  acoes: any[] = [];
  alerta: AlertaModel = new AlertaModel();

  constructor(
    private acaoService: AcaoService,
    private alertaService: AlertaService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.acaoService.listarAcoes().subscribe({
      next: (dados) => (this.acoes = dados),
      error: (err) => console.error('Erro ao carregar ações:', err),
    });

    const alertaId = this.activatedRoute.snapshot.paramMap.get('alertaId');

    if (alertaId) {
      this.alertaService.buscarPorId(alertaId).subscribe({
        next: (dados) => {
          this.alerta = dados;
        },
        error: (err) => {
          console.error('Erro ao buscar alerta:', err);
        },
      });
    }
  }

  confirmar(): void {
    if (!this.alerta.acaoId || !this.alerta.quantidade || !this.alerta.valor) {
      this.mostrarAlerta('Atenção', 'Preencha todos os campos.');
      return;
    }

    const acaoSelecionada = this.acoes.find((a) => a.id === this.alerta.acaoId);

    if (!acaoSelecionada) {
      this.mostrarAlerta('Erro', 'Ação não encontrada.');
      return;
    }

    if (Number(this.alerta.valor) >= Number(acaoSelecionada.valor)) {
      this.mostrarAlerta(
        'Valor inválido',
        `O valor do alerta deve ser menor que o valor atual da ação (R$ ${acaoSelecionada.valor}).`,
      );
      return;
    }
    const usuarioId = this.authService.getUsuarioId() || '';
    this.alerta.usuarioId = usuarioId;

    this.alertaService.salvar(this.alerta).subscribe({
      next: () => {
        this.mostrarAlerta('Sucesso', 'Alerta salvo com sucesso!').then(() => {
          this.navController.navigateBack('/alertas');
        });
      },
      error: (err) => {
        console.error('Erro ao salvar alerta:', err);
        this.mostrarAlerta('Erro', 'Não foi possível salvar o alerta.');
      },
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
