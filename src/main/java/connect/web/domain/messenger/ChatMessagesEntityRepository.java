package connect.web.domain.messenger;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatMessagesEntityRepository extends JpaRepository<ChatMessagesEntity, Integer> {
    @Query(value =  " select *  from chat_messages where chat_room_id = :chatRoomId ", nativeQuery = true)
    List<ChatMessagesEntity> findAllByChatRoomId(int chatRoomId);
}
