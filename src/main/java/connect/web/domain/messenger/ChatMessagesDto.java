package connect.web.domain.messenger;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessagesDto {
    private int chatMessagesId; //메세지 고유 번호, 자동증가
    private String content; // 메세지 내용
    private int chatRoomId; // 보낸 채팅방 id
    private String cdate; // 메세지 생성 날짜

    private String memberName; // 메세지 보낸사람 이름
    private int memberNo; // 회원 번호

    private String msgType; // 메세지 타입
    private String originalFilename; //실제 순수 파일명
    private String uuidFile; //식별된 파일명
    private String sizeKb; // 용량

    private List<MultipartFile> files;    //첨부파일 입력용


    public ChatMessagesEntity toEntity(){
        return ChatMessagesEntity.builder()
                .content(this.content)
                .msgType(this.msgType)
                .originalFilename(this.originalFilename)
                .uuidFile(this.uuidFile)
                .sizeKb(this.sizeKb)
                .build();
    }


}
