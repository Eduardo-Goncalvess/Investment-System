import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBackButton, IonButtons,
  IonFab, IonFabButton, IonIcon
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { CompraService } from '../../services/compra.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBackButton, IonButtons,
    IonFab, IonFabButton, IonIcon
  ]
})
export class ComprasPage implements OnInit {
  compras: any[] = [];

  constructor(
    private compraService: CompraService,
    private authService: AuthService,
    private navController: NavController
  ) {
    addIcons({ addOutline });
  }

  ngOnInit(): void {
    this.carregarCompras();
  }

  ionViewWillEnter(): void {
    this.carregarCompras();
  }

  carregarCompras(): void {
    const usuarioId = this.authService.getUsuarioId() || '';
    console.log('carregarCompras — usuarioId:', usuarioId);
    console.log('carregarCompras — token:', this.authService.getToken());

    this.compraService.listarComprasPorUsuario(usuarioId).subscribe({
next: (dados) => {
  this.compras = dados.sort(
    (a: any, b: any) =>
      new Date(b.data).getTime() -
      new Date(a.data).getTime()
  );
},
      error: (err) => {
        console.error('Erro ao carregar compras:', err);
        this.compras = [];
      }
    });
  }

  irAdicionarCompra(): void {
    this.navController.navigateForward('/add-compra');
  }
}