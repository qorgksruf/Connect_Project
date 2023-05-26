package connect.web.domain.messenger;

import connect.web.domain.member.MemberEntity;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.web.bind.annotation.DeleteMapping;

import javax.persistence.*;

@Entity @Table(name="ChatParticipants")
@Builder @Data
@NoArgsConstructor @AllArgsConstructor
//채팅참여자 테이블
public class ChatParticipantsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int chatParticipantsId; //채팅방 참여자 고유 번호, 자동증가

    @ManyToOne
    @JoinColumn(name="memberNo")
    @ToString.Exclude
    private MemberEntity memberEntity; //멤버 ID

    @ManyToOne
    @JoinColumn(name="chatRoomId")
    @ToString.Exclude
    private ChatRoomsEntity chatRoomsEntity; //  채팅방 ID (fk)
}
