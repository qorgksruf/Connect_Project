package connect.web.config;

import connect.web.controller.messenger.ChattingHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration //컴포넌트 등록 [주요  : Service]
@EnableWebSocket  // WS프로토콜 매핑
public class WebSocketConfiguratoin implements WebSocketConfigurer {
    @Autowired //DI
    private ChattingHandler chattingHandler;
    @Override //서버소켓으로 사용되고 있는 클래스들 등록
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chattingHandler,"/chat2").setAllowedOrigins("*");
        //registry.addHandler(서버소켓 객체, "서버소켓의 (URL or path)") : 서버소켓 등록 함수
        //.setAllowedOrigins("젒속허용 도메인"): 해당 서버소켓으로 부터 요청할수있는 URL / 도메인
        //.setAllowedOrigins("*") : 모든 도메인 가능 localhost:8080 가능하고 3030가능

    }
}