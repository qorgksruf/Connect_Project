package connect.web.domain.member;

import connect.web.domain.board.BoardEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data @AllArgsConstructor @NoArgsConstructor@Builder
@Table( name = "part" )
public class PartEntity {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int partNo;

    @Column private String partName;

    // ↓ 필요해서 임시로 썼습니다ㅎㅎ 지우셔도 대용
    @OneToMany(mappedBy = "partEntity")
    @Builder.Default
    private List<BoardEntity> boardEntityList = new ArrayList<>();

    @OneToMany(mappedBy = "partEntity")
    @Builder.Default
    private List<MemberEntity>  memberEntityList = new ArrayList<>();


    public PartDto toDto() {
        return PartDto.builder()
                .partNo( this.partNo )
                .partName( this.partName )
                .build();
    }


}
