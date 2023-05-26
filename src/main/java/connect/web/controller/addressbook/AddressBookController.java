package connect.web.controller.addressbook;

import connect.web.domain.addressbook.AddressBookDto;
import connect.web.service.addressbook.AddressBookService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/addressbook")
public class AddressBookController {

    @Autowired AddressBookService addressBookService;

    @PostMapping("")
    public byte addAddressBook( AddressBookDto addressBookDto ){
        log.info("Add Address Book : " + addressBookDto );
        return addressBookService.addAddressBook(addressBookDto);
    }

    @DeleteMapping("")
    public boolean deleteAddressBook( @RequestParam int addrNo ) {
        return addressBookService.deleteAddressBook( addrNo );
    }

    @PostMapping("/update")
    public boolean updateAddressBook( AddressBookDto addressBookDto ){
        log.info("업데이트 데이터 체크 : " + addressBookDto );
        return addressBookService.updateAddressBook( addressBookDto );
    }

}
