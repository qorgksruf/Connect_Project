package connect.web.service.messenger;

import connect.web.controller.messenger.ChattingHandler;
import connect.web.domain.member.MemberDto;
import connect.web.domain.member.MemberEntity;
import connect.web.domain.member.MemberEntityRepository;
import connect.web.domain.messenger.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j

public class MessengerService {

    @Autowired //채팅방
    ChatRoomsEntityRepository chatRoomsEntityRepository;
    @Autowired //채팅방 회원체크
    ChatParticipantsEntityRepository chatParticipantsEntityRepository;
    @Autowired //메세지
    ChatMessagesEntityRepository chatMessagesEntityRepository;
    @Autowired // 회원
    MemberEntityRepository memberEntityRepository;
    @Autowired //회원 소켓 전용
    HttpServletRequest request;
    @Autowired //메세지 소켓전용
    ChattingHandler chattingHandler;
    @Autowired
    private HttpServletResponse response; // 응답 객체

    //저장경로
    String path = "C:\\Connect_Project\\build\\resources\\main\\static\\static\\media\\";
    // String path = "C:\\Users\\504\\Desktop\\Connect_Project\\build\\resources\\main\\static\\static\\media\\";
    //"C:\\Users\\504\\Desktop\\Connect_Project\\build\\resources\\main\\static\\static\\media\\";
    //"C:\\Connect_Project\\build\\resources\\main\\static\\static\\media\\"

    /* ---------------------- 0. 로그인 검사 ------------------------- */
    public MemberDto loginMember(){
        String login = (String)request.getSession().getAttribute("login");

        //1. 있는 회원인지 검사 (유효성)
        Optional<MemberEntity> optionalMemberEntity =
                memberEntityRepository.findByMemberId(login);
        //1-2.있으면 MemberNo() 검사
        if(optionalMemberEntity.isPresent()) {
            MemberEntity memberEntity  = optionalMemberEntity.get();
            return memberEntity.toDto();
        }
        return null;
    }

    //* ---------------------- 채팅방 생성 기능 ------------------------- */
    //1. 방생성하기
    @Transactional
    public  boolean createChat(ChatRoomsDto chatRoomsDto){
        // 1-1. 로그인된 회원 빼오기 {header 에서 들고오기}
        MemberEntity memberEntity = memberEntityRepository.findById(chatRoomsDto.getMemberNo()).get();
        // 1-2. ChatRoom html -> dto -> entity
        ChatRoomsEntity chatRoomsEntity = chatRoomsDto.toEntity();
        //1-3. chatRooms <- member 단방향
        chatRoomsEntity.setMemberEntity(memberEntity);
        chatRoomsEntityRepository.save(chatRoomsEntity);
        //1-4. chatRooms -> chatParticipants <- member 단방향
        ChatParticipantsEntity chatParticipantsEntity = new ChatParticipantsEntity();
        chatParticipantsEntity.setChatRoomsEntity(chatRoomsEntity);
        chatParticipantsEntity.setMemberEntity(memberEntity);
        chatParticipantsEntityRepository.save(chatParticipantsEntity);
        return true;
    }

    //2.본인이 속한 채팅방 출력
    @Transactional
    public List<ChatRoomsDto> printChat (){
        //1. 회원정보 빼오기 {java에서 빼오기}
        MemberEntity memberEntity =
                memberEntityRepository.findByMemberId(loginMember().getMemberId()).get();

        // 자신이 속한 chatRooms(Id) 여러개 찾기 (ChatParticipantsEntity)
        List<ChatParticipantsEntity> chatParticipantsEntityList =
                chatParticipantsEntityRepository.findByMemberNo(memberEntity.getMemberNo());

        List<ChatRoomsEntity> chatRoomsEntityLst = chatRoomsEntityRepository.findByabc(memberEntity.getMemberNo());
        // 채팅방 리스트
        List<ChatRoomsDto> chatRoomsDtoList = new ArrayList<>();

        chatRoomsEntityLst.forEach((o)->{
            chatRoomsDtoList.add(o.toDto());
        });

        return chatRoomsDtoList;
    }

    //3. 방 이름 수정하기
    @Transactional
    public boolean editChat (ChatRoomsDto chatRoomsDto){
        //현재 수정할려는 채팅방 검사
        Optional<ChatRoomsEntity> optionalChatRoomsEntity =
                chatRoomsEntityRepository.findById(chatRoomsDto.getChatRoomId());

        if( optionalChatRoomsEntity.get().getMemberEntity().getMemberNo() != loginMember().getMemberNo()){
            return false;
        }
        optionalChatRoomsEntity.get().setName(chatRoomsDto.getName());
        return true;
    }

    //4. 방 삭제하기
    @Transactional
    public boolean deletChat(int chatRoomId){
        //방주인 인지 검사
        MemberEntity memberEntity =
                memberEntityRepository.findById( loginMember().getMemberNo()).get();

        ChatRoomsEntity chatRoomsEntity = chatRoomsEntityRepository.findById(chatRoomId).get();

        if(memberEntity.getMemberNo() == chatRoomsEntity.getMemberEntity().getMemberNo()) {
            //삭제
            chatRoomsEntityRepository.delete(chatRoomsEntity);
            return true;
        }
        return false;
    }
    //---------------------------- 채팅방 파일 있을시----------------------------
    //1-1. 채팅방 생성하기
    public boolean CreateChat_file (ChatRoomsDto chatRoomsDto){
        if(chatRoomsDto.getFiles().getSize()>0){
            //1. 만약 동일한 파일명이 생긴다면, 덮어씌울수 있으니[=식별불가능]
            String fileName = UUID.randomUUID().toString()
                    +"_"+chatRoomsDto.getFiles().getOriginalFilename();
            //2. 경로 + 파일명 조합해서 file 클래스 생성
            File fileSave = new File(path+fileName);
            //3. 업로드 // multipartFile.transferTo(저장할 file 클래스의 객체)
            try{chatRoomsDto.getFiles().transferTo(fileSave);}catch(Exception e){log.info("file upload fail : " + e);}

            //4. dto->entity
            ChatRoomsEntity chatRoomsEntity = chatRoomsDto.toEntity();
            chatRoomsEntity.setOriginalFilename(chatRoomsDto.getFiles().getOriginalFilename());
            chatRoomsEntity.setUuidFile(fileName);
            chatRoomsEntity.setSizeKb(chatRoomsDto.getFiles().getSize()/1024 + "kb");

            //5. chatRooms <- member
            MemberEntity memberEntity = memberEntityRepository.findById(chatRoomsDto.getMemberNo()).get();
            chatRoomsEntity.setMemberEntity(memberEntity);
            chatRoomsEntityRepository.save(chatRoomsEntity);

            //6. chatParticipants 설정
            ChatParticipantsEntity chatParticipantsEntity = new ChatParticipantsEntity();
            chatParticipantsEntity.setMemberEntity(memberEntity);
            chatParticipantsEntity.setChatRoomsEntity(chatRoomsEntity);
            chatParticipantsEntityRepository.save(chatParticipantsEntity);
            return true;
        }
        return false;
    }

    //1-2. 채팅방 수정하기
    @Transactional
    public boolean edit_file (ChatRoomsDto chatRoomsDto){
        if(chatRoomsDto.getFiles().getSize()>0){
            //0. 기존의 파일 삭제
            ChatRoomsEntity chatRoomsEntity = chatRoomsEntityRepository.findById(chatRoomsDto.getChatRoomId()).get();
            File fileDelete = new File(path+chatRoomsEntity.getUuidFile());
            fileDelete.delete();

            //1. 파일 저장
            //1-1. 만약 동일한 파일명이 생긴다면, 덮어씌울수 있으니[=식별불가능]
            String fileName = UUID.randomUUID().toString()
                    +"_"+chatRoomsDto.getFiles().getOriginalFilename();
            //1-2. 경로 + 파일명 조합해서 file 클래스 생성
            File fileSave = new File(path+fileName);
            //1-3. 업로드 // multipartFile.transferTo(저장할 file 클래스의 객체)
            try{chatRoomsDto.getFiles().transferTo(fileSave);}catch(Exception e){log.info("file upload fail : " + e);}

            chatRoomsEntity.setOriginalFilename(chatRoomsDto.getFiles().getOriginalFilename());
            chatRoomsEntity.setUuidFile(fileName);
            chatRoomsEntity.setSizeKb(chatRoomsDto.getFiles().getSize()/1024 + "kb");
            chatRoomsEntity.setName(chatRoomsDto.getName());
            return true;
        }
        return false;
    }


    //---------------------------- 메세지 보내기 -------------------------
    //1. 메세지 보내기
    @Transactional
    public boolean sendMessages(ChatMessagesDto messagesDto){
        //1) 현재 받은 메세지를 Entity로 변환
        ChatMessagesEntity chatMessagesEntity = messagesDto.toEntity();
        //2)변환한 Entity에 멤버,채팅방 넣기
        MemberEntity memberEntity = memberEntityRepository.findById(messagesDto.getMemberNo()).get();
        ChatRoomsEntity chatRoomsEntity = chatRoomsEntityRepository.findById(messagesDto.getChatRoomId()).get();
        //chatMessages <- memberEntity
        chatMessagesEntity.setMemberEntity(memberEntity);
        //chatMessages <- chatRooms
        chatMessagesEntity.setChatRoomsEntity(chatRoomsEntity);
        chatMessagesEntityRepository.save(chatMessagesEntity);
        try { // 메시지가 도착한 방번호 전송 [ 해당 방번호를 최신화 할려고 ]
            chattingHandler.handleMessage(null, new TextMessage(String.valueOf(messagesDto.getChatRoomId())) );
        }
        catch (Exception e ){}
        return true;
    }

    //2. 메세지 출력
    @Transactional
    public List<ChatMessagesDto> printMessages(int chatRoomId){
        //현재 채팅방에 속한 메세지 가져오기
        List<ChatMessagesEntity> chatMessagesEntityList =
                chatMessagesEntityRepository.findAllByChatRoomId(chatRoomId);

        //채팅방에 속한 메세지 전체 dto 변환
        List<ChatMessagesDto> chatMessagesDtoList = new ArrayList<>();
        chatMessagesEntityList.forEach((o)->{chatMessagesDtoList.add(o.toDto());});
        return chatMessagesDtoList;
    }

    //3. 메세지 수정하기
    @Transactional
    public boolean editMessages( ChatMessagesDto chatMessagesDto){
        //메세지 수정하기
        Optional<ChatMessagesEntity> chatMessagesEntity =
            chatMessagesEntityRepository.findById(chatMessagesDto.getChatMessagesId());
        chatMessagesEntity.get().setContent(chatMessagesDto.getContent());
        return true;
    }

    //3-1. 개개인의 메세지 가져오기
    @Transactional
    public ChatMessagesDto oneMessage(int chatMessagesId){
        return chatMessagesEntityRepository.findById(chatMessagesId).get().toDto();
    }


    //4. 삭제하기
    @Transactional
    public boolean DeleteMessages(int chatMessagesId){
        //메세지 삭제하기
        Optional<ChatMessagesEntity> chatMessagesEntity =
                chatMessagesEntityRepository.findById(chatMessagesId);
        System.out.println("------------------------");
        System.out.println(chatMessagesId);
        System.out.println(chatMessagesEntity);
        if(chatMessagesEntity.get().getMemberEntity().getMemberNo() ==
                loginMember().getMemberNo()){
                    chatMessagesEntityRepository.delete(chatMessagesEntity.get());
                    return true;
        }
        return false;
    }

    /* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 파일 보내기  ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/

    @Transactional
    //1.파일 전송하기
    public boolean fileUpload( ChatMessagesDto chatMessagesDto){
        if(chatMessagesDto.getFiles().size() != 0 ){ // 첨부파일 존재시
            chatMessagesDto.getFiles().forEach((file) -> {
                //1. 만약 동일한 파일명이 생긴다면, 덮어씌울수 있으니[=식별불가능]
                String fileName = UUID.randomUUID().toString()
                        +"_"+file.getOriginalFilename();
                //2. 경로 + 파일명 조합해서 file 클래스 생성
                File fileSave = new File(path+fileName);
                //3. 업로드 // multipartFile.transferTo(저장할 file 클래스의 객체)
                try{file.transferTo(fileSave);}catch(Exception e){log.info("file upload fail : " + e);}

                //4. 확장자 분리
                String extension = file.getOriginalFilename().substring(
                        file.getOriginalFilename().lastIndexOf(".") + 1);

                //5. 여러 파일이 있을경우 하나씩 메세지를 저장하는 형식. {파일크기,파일의 원본이름, 수정된이름, 채팅방,멤버 넣는중}
                chatMessagesDto.setSizeKb(file.getSize()/1024 + "kb");
                chatMessagesDto.setOriginalFilename(file.getOriginalFilename());
                chatMessagesDto.setUuidFile(fileName); chatMessagesDto.setMsgType(extension);
                ChatMessagesEntity chatMessagesEntity = chatMessagesDto.toEntity();
                chatMessagesEntity.setChatRoomsEntity( chatRoomsEntityRepository.findById(chatMessagesDto.getChatRoomId()).get());
                chatMessagesEntity.setMemberEntity(memberEntityRepository.findById(chatMessagesDto.getMemberNo()).get());
                chatMessagesEntityRepository.save( chatMessagesEntity );
            });
            return true;
        }
        return false;
    }


    //2. 파일 다운로드 하기
    public void fileDownload( String uuidFile ){ // spring 다운로드 관한 API 없음
        String pathFile = path + uuidFile; // 경로+uuid파일명 : 실제 파일이 존재하는 위치
        try {
            // 1. 다운로드 형식 구성
            response.setHeader(  "Content-Disposition", // 헤더 구성 [ 브라우저 다운로드 형식 ]
                    "attchment;filename = " + URLEncoder.encode( uuidFile.split("_")[1], "UTF-8") // 다운로드시 표시될 이름
            );

            //2. 다운로드 스트림 구성
            File file = new File( pathFile ); // 다운로드할 파일의 경로에서 파일객체화

            // 3. 입력 스트림 [  서버가 먼저 다운로드 할 파일의 바이트 읽어오기 = 대상 : 클라이언트가 요청한 파일 ]
            BufferedInputStream fin = new BufferedInputStream( new FileInputStream(file) );
            byte[] bytes = new byte[ (int) file.length() ]; // 파일의 길이[용량=바이트단위] 만큼 바이트 배열 선언
            fin.read( bytes ); // 읽어온 바이트들을 bytes배열 저장
            // 4. 출력 스트림 [ 서버가 읽어온 바이트를 출력할 스트림  = 대상 : response = 현재 서비스 요청한 클라이언트에게 ]
            BufferedOutputStream fout = new BufferedOutputStream( response.getOutputStream() );
            fout.write( bytes ); // 입력스트림에서 읽어온 바이트 배열을 내보내기
            fout.flush(); // 스트림 메모리 초기화
            fin.close(); fout.close(); // 스트림 닫기
        }catch(Exception e){ log.info("file download fail : "+e );}
    }

    //-------------------------------- 초대하기 -------------------------------
    //1. 초대안된 멤버 출력
    @Transactional
    public List<MemberDto>  invite_member(int chatRoomId){
        List<MemberEntity> memberEntityList = memberEntityRepository.findAllByNotInChatRoomId(chatRoomId);
        List<MemberDto> memberDtoList = new ArrayList<>();
        memberEntityList.forEach((o)->{
            memberDtoList.add(o.toDto());
        });
        return memberDtoList;
    }

    //2. 초대하기 함수
    @Transactional
    public boolean invite(ChatParticipantsDto chatParticipantsDto){
        ChatParticipantsEntity chatParticipantsEntity = new ChatParticipantsEntity();
        chatParticipantsEntity.setMemberEntity( memberEntityRepository.findById(chatParticipantsDto.getMemberNo()).get() );
        chatParticipantsEntity.setChatRoomsEntity( chatRoomsEntityRepository.findById(chatParticipantsDto.getChatRoomId()).get() );
        chatParticipantsEntityRepository.save(chatParticipantsEntity);
        return true;
    }

    //3.초대된 멤버 출력
    @Transactional
    public List<MemberDto> in_Member(int chatRoomId){
        List<MemberEntity> memberEntityList = memberEntityRepository.findAllByInChatRoomId(chatRoomId);
        List<MemberDto> memberDtoList = new ArrayList<>();
        memberEntityList.forEach((o)->{
            memberDtoList.add(o.toDto());
        });
        return memberDtoList;
    }

    /*------------------------------------ 나가기 ----------------------------------------*/
    @Transactional
    public boolean leave_chat(int chatRoomId){
         ChatParticipantsEntity chatParticipantsEntity = chatParticipantsEntityRepository.findByChatRoomIdAndMemberNo(
                chatRoomId,loginMember().getMemberNo());
         if(chatParticipantsEntity != null){
             chatParticipantsEntityRepository.delete(chatParticipantsEntity);
             return true;
         }
    return false;
    }

    /* -------------------------------------- 강퇴하기 --------------------------------*/
    @Transactional
    public boolean kick(int chatRoomId, int memberNo){
        ChatParticipantsEntity chatParticipantsEntity = chatParticipantsEntityRepository.findByChatRoomIdAndMemberNo(
                chatRoomId,memberNo);
        chatParticipantsEntityRepository.delete(chatParticipantsEntity);
        return true;
    }

}
