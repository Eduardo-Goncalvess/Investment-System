import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBackButton, IonButtons, IonBadge
} from '@ionic/angular/standalone';
import { CompraService } from '../../services/compra.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-carteira',
  templateUrl: './carteira.page.html',
  styleUrls: ['./carteira.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBackButton, IonButtons, IonBadge
  ]
})
export class CarteiraPage implements OnInit {
  carteira: any[] = [];

  constructor(
    private compraService: CompraService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarCarteira();
  }

  ionViewWillEnter(): void {
    this.carregarCarteira();
  }

  carregarCarteira(): void {
    const usuarioId = this.authService.getUsuarioId() || '';

    this.compraService.consultarCarteira(usuarioId).subscribe({
      next: (dados) => this.carteira = dados,
      error: (err) => {
        console.error('Erro ao carregar carteira:', err);
        this.carteira = [];
      }
    });
  }
}