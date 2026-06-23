export class CompraModel {
  id?: string;
  acaoId: string = '';
  acaoNome?: string;
  quantidade: number = 0;
  valor?: number;  
  valorTotal?: number;
  data?: string;
  usuarioId?: string;
}