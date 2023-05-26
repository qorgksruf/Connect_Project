package connect.web.domain.board;

import connect.web.domain.BaseTime;
import connect.web.domain.member.MemberEntity;
import connect.web.domain.member.PartEntity;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;


@Entity @Table(name="board")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class BoardEntity extends BaseTime {
    @Id @GeneratedValue( strategy = GenerationType.IDENTITY)
    private int boardNo;
    @Column(nullable = false) private String boardTitle;
    @Column(columnDefinition = "longtext") private String boardContent;
    @Column @ColumnDefault("0")
    private int boardView;

    @ManyToOne
    @JoinColumn(name="memberNo")
    @ToString.Exclude
    private MemberEntity memberEntity;

    @ManyToOne
    @JoinColumn(name="partNo")
    @ToString.Exclude
    private PartEntity partEntity;

    @OneToMany(mappedBy = "boardEntity")
    @Builder.Default
    private List<ReplyEntity> replyEntityList = new ArrayList<>();

    public BoardDto toDto() {
        return BoardDto.builder()
                .boardNo(this.boardNo).boardTitle(this.boardTitle) .boardContent(this.boardContent)
                .partNo(this.getPartEntity().getPartNo()) .partName(this.getPartEntity().getPartName())
                .memberNo(this.getMemberEntity().getMemberNo()) .memberName(this.getMemberEntity().getMemberName())
                .boardView(this.boardView)
                .boardDate( this.cdate.toLocalDate().toString().equals(LocalDateTime.now().toLocalDate().toString()) ?
                        this.cdate.toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm:ss")):
                        this.cdate.toLocalDate().format(DateTimeFormatter.ofPattern("yy-MM-dd"))
                )
                .build();
    }
}

