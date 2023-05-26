package connect.web.domain.addressbook;


import connect.web.domain.member.MemberEntity;
import lombok.*;

import javax.persistence.*;

@Entity
@Data @AllArgsConstructor @NoArgsConstructor
@Builder
@Table( name = "addressbook")
public class AddressBookEntity {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int addrNo ;

    @Column private String addrName;
    @Column private String addrPhone;
    @Column private String addrEmail;

    @ManyToOne
    @JoinColumn( name = "groupNo")
    @ToString.Exclude
    private AddressGroupEntity addressGroupEntity;

    @ManyToOne
    @JoinColumn( name = "memberNo")
    @ToString.Exclude
    private MemberEntity memberEntity;

    public AddressBookDto toDto() {
        return AddressBookDto.builder()
                .addrNo( this.addrNo )
                .addrName( this.addrName )
                .addrPhone( this.addrPhone )
                .addrEmail( this.addrEmail )
                .groupNo( this.getAddressGroupEntity().getGroupNo() )
                .memberNo( this.getMemberEntity().getMemberNo() )
                .build();
    }

}
