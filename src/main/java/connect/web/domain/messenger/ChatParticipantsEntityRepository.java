package connect.web.domain.messenger;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatParticipantsEntityRepository extends JpaRepository<ChatParticipantsEntity, Integer> {
    @Query(value =  " select *  from chat_participants where member_no = :memberNo ", nativeQuery = true)
    List<ChatParticipantsEntity> findByMemberNo(int memberNo);

    @Query(value =  " select *  from chat_participants where chat_room_id= :chatRoomId  and member_no = :memberNo ", nativeQuery = true)
    ChatParticipantsEntity findByChatRoomIdAndMemberNo(int chatRoomId, int memberNo);
}
