package connect.web.controller.approval;


import connect.web.domain.approval.ApprovalDto;
import connect.web.domain.approval.ApprovalEntity;
import connect.web.service.approval.ApprovalService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/approval")
public class ApprovalController {

    @Autowired
    private ApprovalService approvalService;

    @Autowired
    HttpServletRequest request;


    //서류 등록
    @PostMapping("/awrite")
    public boolean approvalWrite(@RequestBody ApprovalDto approvalDto  ){
        log.info("c approvalWrite : "+approvalDto);
        boolean result = approvalService.approvalWrite(approvalDto);
        return result;
    }

    //해당게시물출력 [2023-05-15]
    @GetMapping("/getPrint")
    public ApprovalDto print(@RequestParam int approvalNo){
        ApprovalDto result = approvalService.print(approvalNo);
        return result;
    }



    //STATUS 상태에따른 서류 [2023-05-11 월 작업 ]
    @GetMapping("/getUserRank")
    public List<ApprovalDto> approvalDtoList( ){
        List<ApprovalDto> result = approvalService.approvalDtoList();
        log.info("c status에 따른 게시물출력 result:::"+result);
        return result;
    }

    //해당게시물출력 [2023-05-15]
/*    @GetMapping("/getPrint")
    public int print(@RequestParam int approvalNo){
        log.info("c accept::::approvalNo:::"+approvalNo);
        int result = approvalService.print(approvalNo);
        log.info("c accept result::::: "+result);
        return result;
    }*/



    /*수락버튼클릭 [2023-05-12]*/
    @GetMapping("/getAccept")
    public int accept(@RequestParam int approvalNo){
        log.info("c accept::::approvalNo:::"+approvalNo);
        int result = approvalService.accept(approvalNo);
        log.info("c accept result::::: "+result);
        return result;
    }


    /*반려버튼클릭 [2023-05-12]*/
    @GetMapping("/getRefuse")
    public int refuse(@RequestParam int approvalNo){
        log.info("c refuse::::approvalNo:::"+approvalNo);
        int result = approvalService.refuse(approvalNo);
        log.info("c refuse result::::: "+result);
        return result;
    }


    //내가 쓴 서류 결제상태 출력 [2023-05-15 월 작업 ]
    @GetMapping("/getMyprint")
    public List<ApprovalDto> myapprovalDtoList( ){
        List<ApprovalDto> result = approvalService.myapprovalDtoList();
        log.info("c result:::"+result);
        return result;
    }

    /*내가쓴 게시물 삭제부분*/
    @DeleteMapping("/delete")
    public int delete(@RequestParam int approvalNo){
        log.info("s delete::::approvalNo:::"+approvalNo);
        int result = approvalService.delete(approvalNo);
        log.info("s delete result::::: "+result);
        return result;
    }



/*
    //맴버랭크 빼내기 함수
    @GetMapping("/getUserRank")
    public List<ApprovalDto> getUserRank() {
      //String result = (String)request.getSession().getAttribute("login");
        List<ApprovalDto>result = approvalService.getUserRank();
        log.info("getUserRank getUserRank() result ::: " + result);
        // List<ApprovalDto> result = approvalService.approvalDtos();
        //log.info("c result:::"+result);
        return result;
    }
*/




}
