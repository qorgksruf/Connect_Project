package connect.web.domain.messenger;

import connect.web.domain.BaseTime;
import connect.web.domain.member.MemberEntity;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;


@Entity @Table(name="ChatRooms")
@Data@Builder
@NoArgsConstructor@AllArgsConstructor
//채팅방 테이블
public class ChatRoomsEntity extends BaseTime { // 채팅방 생성날짜를 전달받기위함

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int chatRoomId; //채팅방 고유 번호, 자동증가

    @Column(nullable = false)
    private String name; //채팅방 이름

    @ManyToOne
    @JoinColumn(name="memberNo")
    @ToString.Exclude
    private MemberEntity memberEntity; //방주인

    @OneToMany( mappedBy = "chatRoomsEntity")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<ChatParticipantsEntity> chatParticipantsEntityList = new ArrayList<>();

    @OneToMany( mappedBy = "chatRoomsEntity")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<ChatMessagesEntity> chatMessagesEntityList = new ArrayList<>();

    @Column(nullable = true)
    private String originalFilename; //실제 순수 파일명
    @Column(nullable = true)
    private String uuidFile; //식별된 파일명
    @Column(nullable = true)
    private String sizeKb; // 용량
    public ChatRoomsDto toDto(){
        return ChatRoomsDto.builder()
                .chatRoomId(this.chatRoomId)
                .name(this.name)
                .cdate(
                    //만약 작성 날짜/시간중 날짜가 현재 날짜와 동일하다면
                    this.cdate.toLocalDate().toString().equals(LocalDateTime.now().toLocalDate().toString()) ?
                    this.cdate.toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")) :
                    this.cdate.toLocalDate().format(DateTimeFormatter.ofPattern("yy-MM-dd") )
                )
                .memberNo(this.memberEntity.getMemberNo())
                .originalFilename(this.originalFilename)
                .uuidFile(this.uuidFile)
                .build();
    }
}

