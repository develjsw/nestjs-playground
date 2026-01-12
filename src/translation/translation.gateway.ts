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

/**
 * Translation WebSocket Gateway
 * 실시간 번역을 위한 WebSocket 통신 계층
 *
 * - WebSocket 연결 관리
 * - 클라이언트 메시지 수신 및 응답
 * - 실시간 번역 결과 전송
 */
@WebSocketGateway({
  cors: {
    origin: '*', // 개발 환경용 - 프로덕션에서는 구체적인 origin 지정 필요
  },
})
export class TranslationGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TranslationGateway.name);

  constructor(private readonly translationService: TranslationService) {}

  /** 클라이언트 연결 이벤트 */
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /** 클라이언트 연결 해제 이벤트 */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * 번역 요청 처리
   * @param client WebSocket 클라이언트
   * @param data 번역 요청 데이터
   */
  @SubscribeMessage('translate')
  async handleTranslate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: TranslateRequestDto,
  ) {
    try {
      this.logger.log(`Translation request from ${client.id}`);

      const result = await this.translationService.translate(data);

      client.emit('translation-result', {
        success: true,
        data: result,
      });
    } catch (error) {
      this.logger.error(`Translation error for ${client.id}:`, error);

      // 에러 응답 전송
      client.emit('translation-error', {
        success: false,
        error: error.message || 'Translation failed',
      });
    }
  }
}
