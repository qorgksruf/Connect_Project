package connect.web.service.member;

import connect.web.domain.member.MemberDto;
import connect.web.domain.member.MemberEntity;
import connect.web.domain.member.MemberEntityRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.Optional;

@Slf4j
@Service
public class LoginService {

    @Autowired MemberEntityRepository memberEntityRepository;
    @Autowired HttpServletRequest request;


    // 로그인 메소드
    public boolean login( MemberDto memberDto ) {
        // JS 로부터 데이터 들어오는 지 확인용
        log.info("Login Service : " + memberDto );

        Optional<MemberEntity> optionalMemberEntity = memberEntityRepository.findByMemberId( memberDto.getMemberId() );

        if( optionalMemberEntity.isPresent() ){ // 아이디로 엔티티를 찾아 존재한다면
            // 찾은엔티티의 패스워드와 입력받은 패스워드가 일치한다면
            MemberEntity memberEntity = optionalMemberEntity.get();

            if( memberEntity.getMemberPwd().equals( memberDto.getMemberPwd() ) ){

                return true;
            }
        }
        return false;
    }

    // 로그인된 세션정보를 반환해주는 메소드
    public MemberDto loginInfo() {

        log.info( "info session : " + request.getSession().getAttribute( "login" ) );

        String memberId = (String)request.getSession().getAttribute("login");

        Optional<MemberEntity> optionalMemberEntity = memberEntityRepository.findByMemberId( memberId );

        if( optionalMemberEntity.isPresent() ) {

            MemberEntity memberEntity = optionalMemberEntity.get();

            return memberEntity.toDto();

        }else{
            return new MemberDto();
        }
    }


    // 로그아웃
    public boolean logout() {
        request.getSession().setAttribute("login" , null );
        return true;
    }



}
