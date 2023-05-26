package connect.web.domain.messenger;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRoomsEntityRepository extends JpaRepository<ChatRoomsEntity,Integer> {
    @Query(value=" select *  from Chat_Rooms r join  Chat_Participants p  " +
            " on r.chat_room_id = p.chat_room_id " +
            " where p.member_no= :memberNo ;",nativeQuery = true)
    List<ChatRoomsEntity> findByabc(int memberNo);
}
