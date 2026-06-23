export class AlertaModel {
  id?: string;
  acaoId: string = '';
  nome?: string;
  quantidade: number = 0;
  valor: number = 0;
  ativo: boolean = true;
  usuarioId?: string;
}