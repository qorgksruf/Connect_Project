package connect.web.domain.addressbook;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressBookEntityRepository extends JpaRepository<AddressBookEntity , Integer> {

    @Query( value = "select * from addressbook where group_no = :groupNo and member_no = :memberNo" , nativeQuery = true )
    List<AddressBookEntity> findAddressBook( int groupNo , int memberNo );

}
