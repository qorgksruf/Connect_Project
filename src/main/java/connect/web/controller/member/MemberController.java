package connect.web.controller.member;

import connect.web.domain.member.MemberDto;
import connect.web.service.member.MemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired MemberService memberService;

    // 1. 회원 등록하기
    @PostMapping("/add")
    public boolean add( MemberDto memberDto ) {
        log.info("add controller : " + memberDto );
        return memberService.add(memberDto);
    }

    // 2. 모든 멤버 호출하기
    @GetMapping("")
    public List<MemberDto> getMembers() {
        return memberService.getMembers();
    }


    // 3. 멤버 삭제하기
    @DeleteMapping("")
    public boolean deleteMember( @RequestParam int memberNo ){
        return memberService.deleteMember(memberNo);
    }


    // 4. 멤버 수정하기
    @PostMapping("/update")
    public byte updateMember( MemberDto memberDto ){
        log.info( "put controller : " + memberDto );
        return memberService.updateMember(memberDto);
    }
}
