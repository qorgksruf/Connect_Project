package connect.web.service.member;

import connect.web.domain.member.*;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Slf4j
@Service
public class MemberService {

    @Autowired MemberEntityRepository memberEntityRepository;
    @Autowired PartEntityRepository partEntityRepository;

    String path = "C:\\java\\";

    // 1. 회원 등록하기
    @Transactional
    public boolean add( MemberDto memberDto) {
        
        // 1. 입력된 partNo 로 엔티티 찾기
        Optional<PartEntity> optionalPartEntity = partEntityRepository.findById( memberDto.getPartNo() );

        if( optionalPartEntity.isPresent() ){ // 만약에 입력받은 부서값이 존재하면
            // 전달받은 DTO 를 엔티티로 변환 후 저장

            if( memberDto.getMemberProfile() != null && !memberDto.getMemberProfile().isEmpty() ) { // 첨부파일이 존재하면

                log.info("첨부파일 있음 +++++++++++++++++++++");
                String fileName = UUID.randomUUID().toString() + "_" + memberDto.getMemberProfile().getOriginalFilename() ;

                File file = new File( path + fileName );

                try{
                    memberDto.getMemberProfile().transferTo( file );
                    memberDto.setUuidFilename( fileName );
                }catch (Exception e){
                    log.info("file upload failed : " + e );
                }
            }

            MemberEntity memberEntity = memberEntityRepository.save( memberDto.toEntity() );

            if( memberEntity.getMemberNo() > 0 ){ // 만약 저장된 getMemberNo 값이 0 이상일경우 -> 저장성공

                // * member <-> part 양방향 저장
                memberEntity.setPartEntity( optionalPartEntity.get() );
                optionalPartEntity.get().getMemberEntityList().add( memberEntity );

                return true;
            }
        }
        // 2. 데이터 저장 후 controller return
        return false;
    }

    // 2. 모든 멤버 호출하기
    public List<MemberDto> getMembers() {
        // member 테이블 내 모든 레코드 조회하기
        List<MemberEntity> memberEntityList = memberEntityRepository.findAll();

        // 조회된 MemberEntity > DTO 로 형변환
        List<MemberDto> memberDtoList = memberEntityList.stream().map(
                memberEntity -> memberEntity.toDto() ).collect(Collectors.toList());

        log.info( "dto 형변환 : " + memberDtoList );
        return memberDtoList;
    }

    // 3. 멤버 삭제하기
    public boolean deleteMember( int memberNo ) {

        Optional<MemberEntity> optionalMemberEntity = memberEntityRepository.findById( memberNo );
        if( optionalMemberEntity.isPresent() ){
            memberEntityRepository.delete( optionalMemberEntity.get() );
            return true;
        }

        return false;
    }



    // 4. 멤버 수정하기
    @Transactional
    public byte updateMember( MemberDto memberDto ){
        log.info("put : " + memberDto );
        Optional<MemberEntity> optionalMemberEntity = memberEntityRepository.findById( memberDto.getMemberNo() );

        if( optionalMemberEntity.isPresent() ){

            MemberEntity memberEntity = optionalMemberEntity.get();

            // 만약에 입력받은 패스워드와 패스워드 확인이 일치하지 않는다면
            if( !memberDto.getMemberPwd().equals( memberDto.getMemberPwdConfirm() ) ){
                return 1;
            }else{

                if( memberDto.getMemberPwd().equals("") || memberDto.getMemberPwdConfirm().equals("") ){
                    memberDto.setMemberPwd( memberEntity.getMemberPwd() );
                }

                PartEntity partEntity = partEntityRepository.findById( memberDto.getPartNo() ).get() ;


                // 만약에 첨부파일이 존재한다면
                if( memberDto.getMemberProfile() != null && !memberDto.getMemberProfile().isEmpty() ){

                    String fileName = UUID.randomUUID().toString() + "_" + memberDto.getMemberProfile().getOriginalFilename() ;

                    File file = new File( path + fileName );

                    try{
                        memberDto.getMemberProfile().transferTo( file );
                        memberEntity.setUuidFilename( fileName );
                    }catch (Exception e){
                        log.info("file upload failed : " + e );
                    }

                    memberEntity.setMemberEmail( memberDto.getMemberEmail() );
                    memberEntity.setMemberName( memberDto.getMemberName() );
                    memberEntity.setMemberPhone( memberDto.getMemberPhone() );
                    memberEntity.setMemberPwd( memberDto.getMemberPwd() );
                    memberEntity.setMemberRank( memberDto.getMemberRank() );
                    memberEntity.setPartEntity( partEntity );

                    return 0 ;

                }else{ // 첨부파일이 존재하지 않는다면

                    memberEntity.setMemberEmail( memberDto.getMemberEmail() );
                    memberEntity.setMemberName( memberDto.getMemberName() );
                    memberEntity.setMemberPhone( memberDto.getMemberPhone() );
                    memberEntity.setMemberPwd( memberDto.getMemberPwd() );
                    memberEntity.setMemberRank( memberDto.getMemberRank() );
                    memberEntity.setPartEntity( partEntity );

                    return 0;

                }
            }

        }

        return 2;
    }


}
