package connect.web.domain.addressbook;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressGroupEntityRepository extends JpaRepository<AddressGroupEntity , Integer> {

    @Query( value = "select * from address_group where member_no = :memberNo" , nativeQuery = true )
    List<AddressGroupEntity> findGroupList( int memberNo);

}
