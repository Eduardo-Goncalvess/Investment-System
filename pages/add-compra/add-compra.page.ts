import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonInput,
  IonButton, IonItem, IonLabel, IonBackButton, IonButtons,
  IonSelect, IonSelectOption, IonSpinner, AlertController
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { AcaoService } from '../../services/acao.service';
import { CompraService } from '../../services/compra.service';
import { AuthService } from '../../services/auth.service';
import { CompraModel } from '../../model/compra.model';

@Component({
  selector: 'app-add-compra',
  templateUrl: './add-compra.page.html',
  styleUrls: ['./add-compra.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle,
    IonToolbar, IonInput, IonButton, IonItem, IonLabel,
    IonBackButton, IonButtons, IonSelect, IonSelectOption, IonSpinner
  ]
})
export class AddCompraPage implements OnInit {
  acoes: any[] = [];
  carregando: boolean = true;
  compra: CompraModel = new CompraModel();
  acaoSelecionada: any = null;
  valorTotal: number = 0;

  constructor(
    private acaoService: AcaoService,
    private compraService: CompraService,
    private authService: AuthService,
    private navController: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.carregarAcoes();
  }

  ionViewWillEnter(): void {
    this.carregarAcoes();
  }

  carregarAcoes(): void {
    this.carregando = true;
    this.acaoService.listarAcoes().subscribe({
      next: (dados) => {
        console.log('Ações recebidas:', dados);
        this.acoes = dados;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar ações:', err);
        this.carregando = false;
        this.mostrarAlerta('Erro', `Não foi possível carregar as ações. Status: ${err.status}`);
      }
    });
  }

  onAcaoChange(): void {
    this.acaoSelecionada = this.acoes.find(a => a.id === this.compra.acaoId);
    console.log('Ação selecionada:', this.acaoSelecionada);
    this.calcularTotal();
  }

  calcularTotal(): void {
    if (this.acaoSelecionada && this.compra.quantidade > 0) {
      // Tenta os dois nomes de campo possíveis
      const valor = this.acaoSelecionada.valorAtual
        ?? this.acaoSelecionada.valor
        ?? this.acaoSelecionada.price
        ?? 0;
      this.valorTotal = valor * this.compra.quantidade;
    } else {
      this.valorTotal = 0;
    }
  }

confirmar(): void {
  if (!this.compra.acaoId || !this.compra.quantidade || this.compra.quantidade <= 0) {
    this.mostrarAlerta('Atenção', 'Selecione uma ação e informe uma quantidade válida.');
    return;
  }

  const usuarioId = this.authService.getUsuarioId() || '';

  this.compra.usuarioId = usuarioId;
this.compra.valor = this.valorTotal;
this.compra.valorTotal = this.valorTotal;

  console.log('Enviando compra:', this.compra);

  this.compraService.realizarCompra(this.compra).subscribe({
    next: (res) => {
      console.log('Compra realizada:', res);
      this.mostrarAlerta('Sucesso', 'Compra realizada com sucesso!').then(() => {
        this.navController.navigateBack('/compras');
      });
    },
    error: (err) => {
      console.error('Erro na compra:', err);
      this.mostrarAlerta('Erro', `Não foi possível realizar a compra. Status: ${err.status}`);
    }
  });
}

  private async mostrarAlerta(cabecalho: string, mensagem: string): Promise<any> {
    const alert = await this.alertController.create({
      header: cabecalho, message: mensagem, buttons: ['OK']
    });
    await alert.present();
    return alert.onDidDismiss();
  }
}