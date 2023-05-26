package connect.web.domain.board;

import connect.web.domain.BaseTime;
import connect.web.domain.member.MemberEntity;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Entity@Table(name="reply")
@Data @NoArgsConstructor@AllArgsConstructor@Builder
public class ReplyEntity extends BaseTime{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int replyNo;
    @Column
    private String replyContent;
    // 작성자 fk
    @ManyToOne @JoinColumn(name="memberNo") @ToString.Exclude
    private MemberEntity memberEntity;
    // 게시물fk
    @ManyToOne @JoinColumn(name="boardNo") @ToString.Exclude
    private BoardEntity boardEntity;

    public ReplyDto todto(){
        return ReplyDto.builder()
                .replyNo(this.replyNo).replyContent(this.replyContent)
                .replyDate( this.cdate.toLocalDate().toString().equals(LocalDateTime.now().toLocalDate().toString()) ?
                        this.cdate.toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm:ss")):
                        this.cdate.toLocalDate().format(DateTimeFormatter.ofPattern("yy-MM-dd"))
                )
                .memberNo(this.memberEntity.getMemberNo())
                .memberName(this.memberEntity.getMemberName())
                .build();
    }
}
