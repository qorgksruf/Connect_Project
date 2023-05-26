package connect.web.controller.messenger;

import connect.web.domain.member.MemberDto;
import connect.web.domain.member.MemberEntity;
import connect.web.domain.messenger.ChatMessagesDto;
import connect.web.domain.messenger.ChatParticipantsDto;
import connect.web.domain.messenger.ChatParticipantsEntity;
import connect.web.domain.messenger.ChatRoomsDto;
import connect.web.service.messenger.MessengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/chat")
public class MessengerController {
    @Autowired
    private MessengerService messengerService;

    //----------------------- 로그인 기능 --------------------------------
    //0. 로그인된 MemberNo() 꺼내오기
    @GetMapping("/login")
    public MemberDto loginMemberNo(){
        return messengerService.loginMember();
    }

    //----------------------- 채팅방 기능 --------------------------------
    //1.방 만들기
    @PostMapping("")
    public boolean CreateChat (@RequestBody ChatRoomsDto chatRoomsDto){
        return messengerService.createChat(chatRoomsDto);
    }

    //2. 방 출력하기
    @GetMapping("")
    public List<ChatRoomsDto> printChat(){
        return messengerService.printChat();
    }

    //3. 방 수정하기
    @PutMapping("")
    public boolean editChat (@RequestBody ChatRoomsDto chatRoomsDto){
        return messengerService.editChat(chatRoomsDto);
    }

    //4. 방삭제하기
    @DeleteMapping("")
    public boolean deletChat(@RequestParam int chatRoomId){
        return messengerService.deletChat(chatRoomId);
    }

    // ------------------------------------- 채팅방 파일 -----------------------------

    //1. 채팅있는 파일창 생성하기
    @PostMapping("/file")
    public boolean CreateChat_file (ChatRoomsDto chatRoomsDto){
        return messengerService.CreateChat_file(chatRoomsDto);
    }

    @PutMapping("/update")
    public boolean edit_file (ChatRoomsDto chatRoomsDto){
        return messengerService.edit_file(chatRoomsDto);
    }

    //------------------------------------- 메세지 보내기 ----------------------------------
    //1. 메세지 보내기
    @PostMapping("/message")
    public boolean sendMessages(@RequestBody ChatMessagesDto chatMessagesDto){
        return messengerService.sendMessages(chatMessagesDto);
    }

    //2. 메세지 출력하기
    @GetMapping("/message")
    public List<ChatMessagesDto> printMessages(@RequestParam  int chatRoomId) {
        return  messengerService.printMessages(chatRoomId);
    }

    //3. 메세지 수정하기
    @PutMapping("/message")
    public boolean editMessages(@RequestBody ChatMessagesDto chatMessagesDto){
        return messengerService.editMessages(chatMessagesDto);
    }

    //3-1. 하나의 메세지 가져오기
    @GetMapping("/oneMessage")
    public ChatMessagesDto oneMessage(@RequestParam int chatMessagesId){
        return messengerService.oneMessage(chatMessagesId);
    }

    //4. 메세지 삭제하기
    @DeleteMapping("/message")
    public boolean DeleteMessages(int chatMessagesId){
        System.out.println("--------------------");
        System.out.println(chatMessagesId);
        return messengerService.DeleteMessages(chatMessagesId);
    }

    /* -------------------------------- 메세지 파일 ----------------------------*/
    //1. 파일 보내기 (메세지)
    @PostMapping("/fileUpload") //chat 관련 첨부파일 업로드
    public boolean fileUpload(ChatMessagesDto chatMessagesDto){
      return messengerService.fileUpload(chatMessagesDto);
    }

    //2. 파일 다운로드하기
    @GetMapping("/fileDownload") //char 관련 첨부파일 다운로드
    public void fileDownload( @RequestParam("uuidFile") String uuidFile ){
        System.out.println("uuidFile : " + uuidFile);
        messengerService.fileDownload(uuidFile);
    }

    /*---------------------------------- 채팅방 초대하기 --------------------------*/
    //1. 초대안된 회원 목록 출력하기
    @GetMapping("/invite")
    public List<MemberDto>  invite_member(int chatRoomId){
        return messengerService.invite_member(chatRoomId);
    }

    //2. 초대하기
    @PostMapping("/invite")
    public boolean invite(@RequestBody ChatParticipantsDto chatParticipantsDto){
        return messengerService.invite(chatParticipantsDto);
    }
    //3. 초대한 회원 출력
    @GetMapping("/inMember")
    public List<MemberDto> in_Member(int chatRoomId){
        return messengerService.in_Member(chatRoomId);
    }

    //4. 채팅방 떠나기
    @DeleteMapping("/leave")
    public boolean leave_chat(@RequestParam int chatRoomId){return messengerService.leave_chat(chatRoomId);}

    //5. 채팅방 강퇴하기
    @DeleteMapping("/kick")
    public boolean kick(@RequestParam int chatRoomId, @RequestParam int memberNo ){return messengerService.kick(chatRoomId,memberNo);}

}
