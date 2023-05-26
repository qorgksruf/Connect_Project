package connect.web.domain.messenger;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data@Builder
@AllArgsConstructor@NoArgsConstructor
public class ChatParticipantsDto {
    private int chatParticipantsId; //채팅참여자 고유 번호
    private int memberNo; //채팅참여자의 멤버 id
    private int chatRoomId; // 채팅방 번호

}
