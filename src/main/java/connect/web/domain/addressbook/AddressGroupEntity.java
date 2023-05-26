package connect.web.domain.addressbook;

import connect.web.domain.member.MemberEntity;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Data @AllArgsConstructor @NoArgsConstructor
@Builder
@Table( name = "addressGroup")
public class AddressGroupEntity {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int groupNo;

    @Column private String groupName;
    @Column private int groupType;

    @ManyToOne
    @JoinColumn( name = "memberNo")
    @ToString.Exclude
    private MemberEntity memberEntity;

    @OneToMany( mappedBy = "addressGroupEntity" , cascade = CascadeType.REMOVE )
    @Builder.Default
    private List<AddressBookEntity> addressBookEntityList = new ArrayList<>();

    public AddressGroupDto toDto() {
        return AddressGroupDto.builder()
                .groupNo( this.groupNo )
                .groupName( this.groupName )
                .groupType( this.groupType )
                .memberNo( this.memberEntity.getMemberNo())
                .addressBookDtoList(
                    this.addressBookEntityList.stream().map(
                            o -> o.toDto()
                    ).collect(Collectors.toList())
                )
                .build();
    }

}

