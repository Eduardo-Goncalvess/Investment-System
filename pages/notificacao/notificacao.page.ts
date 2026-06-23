import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonBackButton, IonButtons, IonButton, IonLabel
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertaModel } from '../../model/alerta.model';
import { AlertaService } from '../../services/alerta.service';

@Component({
  selector: 'app-notificacao',
  templateUrl: './notificacao.page.html',
  styleUrls: ['./notificacao.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle,
    IonToolbar, IonBackButton, IonButtons, IonButton
  ]
})
export class NotificacaoPage implements OnInit {
  alerta: AlertaModel = new AlertaModel();

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertaService: AlertaService,
    private navController: NavController
  ) {}

  ngOnInit(): void {
    const alertaId = Number(this.activatedRoute.snapshot.paramMap.get('alertaId'));
    if (alertaId) {
      this.alertaService.buscarPorId(String(alertaId)).subscribe({
        next: (dados) => this.alerta = dados
      });
    }
  }

  desligar(): void {
    this.alerta.ativo = false;
    this.alertaService.salvar(this.alerta).subscribe(() => {
      this.navController.navigateBack('/menu');
    });
  }
}