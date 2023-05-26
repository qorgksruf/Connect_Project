package connect.web.domain.board;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardEntityRepository extends JpaRepository<BoardEntity , Integer> {
    // [김동혁] 검색
    @Query(value = "select * from board " +
            " where " +
            " if(:part_no = 0 , part_no like '%%' , part_no = :part_no) and " +
            " if( :key = '' , true , if(:key 'board_title' , board_title like %:keyword% , board_content like %:keyword%) )"
            , nativeQuery = true)
            // 만약 부서가 없으면 조건 없음 즉 모든 레코드를 반환하고 아니면 일치하는 부서의 레코드 반환
            // key값이 빈 문자열이면 모든 레코드 반환하고 아니면 key값이 board_title이면 
            // board_title 컬럼에서 keyword 값을 포함하는 레코드를 반환하고 아니면 board_content컬럼에서
            // keyword 값을 포함하는 레코드를 반환한다.
    Page<BoardEntity> findBySearch(int part_no , String key , String keyword , Pageable pageable);
}
