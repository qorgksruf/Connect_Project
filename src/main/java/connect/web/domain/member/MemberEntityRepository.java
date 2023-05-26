package connect.web.domain.member;

import connect.web.domain.messenger.ChatMessagesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberEntityRepository extends JpaRepository<MemberEntity , Integer > {

    // 멤버아이디로 엔티티 찾기 ( 반환타입 : 옵셔널 )
    Optional<MemberEntity> findByMemberId( String memberId );


    // 멤버 아이디로 회원번호(PK) 찾기
    public int findByMemberNo(String memberId);

    //멤버이름으로 아이디 찾기
    public MemberEntity findByMemberName(String memberName);

    //2023-05-21 이경석 MessengerController invite_member 함수를 위해 필요 (326번쨰 줄)
    // 초대하기위해 채팅방에 없는사람을 출력하기 위함
    @Query(value =  "select * from member where member_No NOT IN(select member_No from Chat_Participants where chat_room_id = :chatRoomId );", nativeQuery = true)
    List<MemberEntity> findAllByNotInChatRoomId(int chatRoomId);
    //채팅방에 있는 회원 출력하기 위함
    @Query(value =  "select * from member where member_No IN(select member_No from Chat_Participants where chat_room_id = :chatRoomId );", nativeQuery = true)
    List<MemberEntity> findAllByInChatRoomId(int chatRoomId);

}
