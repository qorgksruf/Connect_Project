package connect.web.domain.member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartEntityRepository extends JpaRepository<PartEntity , Integer> {

    //[2023-05-16 백한결작업] URL: ApprovalService.java 186 line
    @Query( value ="select p.part_name from member m, part p  where p.part_no = m.part_no and m.member_no=:memberNo ",nativeQuery = true)
    Optional<PartEntity> findPartName(@Param("memberNo")int memberNo);

}
