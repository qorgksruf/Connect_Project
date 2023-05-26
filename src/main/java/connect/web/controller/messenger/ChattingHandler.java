package connect.web.controller.messenger;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@Component //빈 등록 [스프링 해당 클래스 관리 = 제어 역전]
@Slf4j // 로그
public class ChattingHandler extends TextWebSocketHandler {

    //0. 서버소켓에 접속한 명단 저장
    private static List<WebSocketSession> memberList = new ArrayList<>();

    @Override  //클라이언트 접속시
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        log.info("afterConnectionEstablished"+session);
        memberList.add(session); //접속시 리스트에 저장 [다른세션과 통신하기 위함]
    }

    @Override //클라이언트에게 메세지 받음
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        log.info("handleTextMessage"+session); log.info("handleTextMessage"+message);
        for(WebSocketSession gotMessages : memberList){
            gotMessages.sendMessage(message); //?
        }
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        super.handleMessage(session, message);
    }

    @Override // 클라이언트가 서버소켓으로 부터 나갔을 때
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("afterConnectionClosed"+session);
        memberList.remove(session);
    }
}