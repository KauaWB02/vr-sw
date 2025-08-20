export interface NotificationInterface {
  mensagemId: string;
  conteudoMensagem: string;
  status: | 'PROCESSADO_SUCESSO' | 'FALHA_PROCESSAMENTO' | 'PROCESSANDO';
}
