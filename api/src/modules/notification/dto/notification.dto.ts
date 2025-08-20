import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  mensagemId: string;

  @IsNotEmpty({ message: 'Conteúdo da mensagem não pode ser vazio.' })
  conteudoMensagem: string;
}