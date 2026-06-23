import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then(m => m.CadastroPage)
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu.page').then(m => m.MenuPage)
  },
  {
    path: 'meus-dados',
    loadComponent: () => import('./pages/meus-dados/meus-dados.page').then(m => m.MeusDadosPage)
  },
  {
    path: 'carteira',
    loadComponent: () => import('./pages/carteira/carteira.page').then(m => m.CarteiraPage)
  },
  {
    path: 'compras',
    loadComponent: () => import('./pages/compras/compras.page').then(m => m.ComprasPage)
  },
  {
    path: 'add-compra',
    loadComponent: () => import('./pages/add-compra/add-compra.page').then(m => m.AddCompraPage)
  },
  {
    path: 'alertas',
    loadComponent: () => import('./pages/alertas/alertas.page').then(m => m.AlertasPage)
  },
  {
    path: 'add-alerta',
    loadComponent: () => import('./pages/add-alerta/add-alerta.page').then(m => m.AddAlertaPage)
  },
  {
    path: 'add-alerta/:alertaId',
    loadComponent: () => import('./pages/add-alerta/add-alerta.page').then(m => m.AddAlertaPage)
  },
  {
    path: 'notificacao/:alertaId',
    loadComponent: () => import('./pages/notificacao/notificacao.page').then(m => m.NotificacaoPage)
  }
];