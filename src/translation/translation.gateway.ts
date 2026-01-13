import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TranslationService } from './translation.service';
import { TranslateRequestDto } from './dto/translate.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TranslationGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TranslationGateway.name);

  constructor(private readonly translationService: TranslationService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('translate')
  async handleTranslate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: TranslateRequestDto,
  ) {
    try {
      client.emit('translation-result', {
        success: true,
        data: await this.translationService.translate(data),
      });
    } catch (error) {
      client.emit('translation-error', {
        success: false,
        error: error instanceof Error ? error.message : 'Translation failed',
      });
    }
  }
}
