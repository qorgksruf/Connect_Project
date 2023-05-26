package connect.web.domain.addressbook;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class AddressBookDto {

    private int addrNo;
    private String addrName;
    private String addrPhone;
    private String addrEmail;
    private int groupNo;
    private int memberNo;

    public AddressBookEntity toEntity(){
        return AddressBookEntity.builder()
                .addrName( this.addrName )
                .addrPhone( this.addrPhone )
                .addrEmail( this.addrEmail )
                .build();
    }

}
