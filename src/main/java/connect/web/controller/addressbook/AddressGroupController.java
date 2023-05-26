package connect.web.controller.addressbook;

import connect.web.domain.addressbook.AddressGroupDto;
import connect.web.service.addressbook.AddressGroupService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/addressgroup")
public class AddressGroupController {

    @Autowired AddressGroupService addressGroupService;

    @PostMapping("")
    public byte addGroup(@RequestBody AddressGroupDto addressGroupDto ){
        log.info("groupdto : " + addressGroupDto );
        return addressGroupService.addGroup(addressGroupDto);
    }

    @GetMapping("")
    public List<AddressGroupDto> getGroup(){
        return addressGroupService.getGroup();
    }


    @PutMapping("")
    public boolean updateGroup(@RequestBody AddressGroupDto addressGroupDto){
        log.info( "put : " + addressGroupDto );
        return addressGroupService.updateGroup(addressGroupDto);
    }

    @DeleteMapping("")
    public boolean deleteGroup(@RequestParam int groupNo ){
        log.info("delete : " + groupNo );
        return addressGroupService.deleteGroup( groupNo );
    }


}
