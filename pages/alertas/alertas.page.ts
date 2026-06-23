import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption,
  IonLabel, IonBackButton, IonButtons, IonFab, IonFabButton, IonIcon,
  IonBadge, AlertController
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';
import { AlertaService } from '../../services/alerta.service';
import { AuthService } from '../../services/auth.service';
import { AcaoService } from '../../services/acao.service';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.page.html',
  styleUrls: ['./alertas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption,
    IonLabel, IonBackButton, IonButtons, IonFab, IonFabButton,
    IonIcon, IonBadge
  ]
})
export class AlertasPage implements OnInit {
  alertas: any[] = [];

  constructor(
    private alertaService: AlertaService,
    private authService: AuthService,
    private navController: NavController,
    private alertController: AlertController,
    private acaoService: AcaoService
  ) {
    addIcons({ addOutline, createOutline, trashOutline });
  }

ngOnInit(): void {
  this.carregarAlertas();

  this.alertaService.alertaAtualizado$.subscribe(() => {
    this.carregarAlertas();
  });
}

  ionViewWillEnter(): void {
    this.carregarAlertas();
  }

  carregarAlertas(): void {
    const usuarioId = this.authService.getUsuarioId() || '';
    this.alertaService.listarAlertasPorUsuario(usuarioId).subscribe({
next: (dados) => {
  this.alertas = dados.sort(
    (a: any, b: any) =>
      new Date(b.data || 0).getTime() -
      new Date(a.data || 0).getTime()
  );

  this.alertas.forEach((alerta) => {
    this.acaoService.buscarPorId(alerta.acaoId).subscribe({
      next: (acao) => {
        alerta.valorAtual = acao.valor;
      }
    });
  });
},
    });
  }

  irAdicionar(): void {
    this.navController.navigateForward('/add-alerta');
  }

  editar(id: string): void {
    this.navController.navigateForward(`/add-alerta/${id}`);
  }

  async excluir(id: string): Promise<void> {
  const alert = await this.alertController.create({
    header: 'Confirmar',
    message: 'Deseja excluir este alerta?',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Excluir',
        handler: () => {
          this.alertaService.excluir(id).subscribe({
            next: () => {
              this.alertas = this.alertas.filter(a => a.id !== id);
            },
            error: (err) => {
              if (err.status === 404) {
                console.warn('Alerta já removido.');
                this.carregarAlertas();
              }
            }
          });
        }
      }
    ]
  });

  await alert.present();
}
}