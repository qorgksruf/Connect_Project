package connect.web.domain.addressbook;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor @NoArgsConstructor @Builder
public class AddressGroupDto {

    private int groupNo;
    private String groupName;
    private int groupType;
    private int memberNo;
    private List<AddressBookDto> addressBookDtoList = new ArrayList<>();

    public AddressGroupEntity toEntity(){
        return AddressGroupEntity.builder()
                .groupName( this.groupName )
                .build();
    }

}
