package connect.web.service.addressbook;

import connect.web.domain.addressbook.*;
import connect.web.domain.member.MemberEntity;
import connect.web.service.member.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AddressBookService {

    @Autowired AddressBookEntityRepository addressBookEntityRepository;
    @Autowired AddressGroupEntityRepository addressGroupEntityRepository;
    @Autowired AddressGroupService addressGroupService;

    @Transactional
    public byte addAddressBook(AddressBookDto addressBookDto ){

        // 로그인한 멤버 찾기
        MemberEntity memberEntity = addressGroupService.getMember();
        if( memberEntity == null ){
            return 2; // 로그인이 되어있지 않을경우
        }


        // 등록한 그룹 찾기
        AddressGroupEntity addressGroupEntity = addressGroupEntityRepository.findById( addressBookDto.getGroupNo() ).get() ;

        AddressBookEntity addressBookEntity = addressBookEntityRepository.save( addressBookDto.toEntity() );

        if( addressBookEntity.getAddrNo() > 0 ){

            // 양방향 설정 ( 회원 <> 주소록 )
            addressBookEntity.setMemberEntity( memberEntity );
            memberEntity.getAddressBookEntityList().add( addressBookEntity );

            // 양방향 설정 ( 주소록그룹 <> 주소록 )
            addressBookEntity.setAddressGroupEntity( addressGroupEntity );
            addressGroupEntity.getAddressBookEntityList().add( addressBookEntity );

            return 0;
        }

        return 1;
    }

    public boolean deleteAddressBook( int addrNo ) {

        Optional<AddressBookEntity> optionalAddressBookEntity = addressBookEntityRepository.findById( addrNo );

        if( optionalAddressBookEntity.isPresent() ){

            AddressBookEntity addressBookEntity = optionalAddressBookEntity.get();
            addressBookEntityRepository.delete( addressBookEntity );
            return true;
        }

        return false;
    }

    @Transactional
    public boolean updateAddressBook( AddressBookDto addressBookDto ){

        Optional<AddressBookEntity> optionalAddressBookEntity = addressBookEntityRepository.findById( addressBookDto.getAddrNo() );

        if( optionalAddressBookEntity.isPresent() ){
            AddressBookEntity addressBookEntity = optionalAddressBookEntity.get();
            addressBookEntity.setAddrName( addressBookDto.getAddrName() );
            addressBookEntity.setAddrPhone( addressBookDto.getAddrPhone() );
            addressBookEntity.setAddrEmail( addressBookDto.getAddrEmail() );
            return true;
        }

        return false;
    }


}
