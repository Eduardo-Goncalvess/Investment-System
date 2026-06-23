import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonIcon
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  walletOutline, cartOutline, notificationsOutline,
  personOutline, logOutOutline
} from 'ionicons/icons';
import { NotificacaoService } from '../../services/notificacao.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonIcon
  ]
})
export class MenuPage implements OnInit {

  constructor(
    private navController: NavController,
    private notificacaoService: NotificacaoService,
    private authService: AuthService
  ) {
    addIcons({ walletOutline, cartOutline, notificationsOutline, personOutline, logOutOutline });
  }

  ngOnInit(): void {
  const usuarioId = this.authService.getUsuarioId();

  if (usuarioId) {
    this.notificacaoService.iniciarConexaoSSE(usuarioId);
  }
  }

  irPara(rota: string): void {
    this.navController.navigateForward(rota);
  }

  sair(): void {
    this.notificacaoService.encerrarConexao();
    this.authService.logout(); // limpa token e usuarioId corretamente
    this.navController.navigateRoot('/login');
  }
}