package connect.web.domain.messenger;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data@Builder
@NoArgsConstructor@AllArgsConstructor
public class ChatRoomsDto {
    private int chatRoomId; //채팅방 고유 번호, 자동증가
    private String name; //채팅방 이름
    private String cdate; // 채팅방 생성 날짜
    private int memberNo; //방주인

    private String originalFilename; //실제 순수 파일명
    private String uuidFile; //식별된 파일명
    private String sizeKb; // 용량
    private MultipartFile files;    //첨부파일 입력용

    private String content; //최근메세지



    public ChatRoomsEntity toEntity(){
        return ChatRoomsEntity.builder()
                .name(this.name)
                .originalFilename(this.originalFilename)
                .uuidFile(this.uuidFile)
                .build();
    }
}

