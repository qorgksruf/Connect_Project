package connect.web.service.approval;

import com.sun.org.apache.bcel.internal.generic.LUSHR;
import connect.web.domain.approval.ApprovalDto;
import connect.web.domain.approval.ApprovalEntity;
import connect.web.domain.approval.ApprovalEntityRepository;
import connect.web.domain.member.MemberEntity;
import connect.web.domain.member.MemberEntityRepository;
import connect.web.domain.member.PartEntity;
import connect.web.domain.member.PartEntityRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ApprovalService {

    //서류작성 ApprovalEntityRepository
    @Autowired
    private ApprovalEntityRepository approvalEntityRepository;

    //서류작성 MemberEntityRepository
    @Autowired
    private MemberEntityRepository memberEntityRepository;

    //부서
    @Autowired
    private PartEntityRepository partEntityRepository;


    @Autowired
    HttpServletRequest request;

    //로그인세션
    public MemberEntity getMember(){
        String memberId =(String)request.getSession().getAttribute("login");
        log.info("로그인세션확인");
        log.info(memberId);

        Optional<MemberEntity> memberEntityOptional = memberEntityRepository.findByMemberId( memberId );

        if(memberEntityOptional.isPresent()) {
            MemberEntity memberEntity = memberEntityOptional.get();
            return memberEntity;
        }
        return null;
    }

    //서류 등록
    @Transactional
    public boolean approvalWrite( ApprovalDto approvalDto){

        String memberId =(String)request.getSession().getAttribute("login");
            log.info("로그인세션확인");
            log.info(memberId);

        Optional<MemberEntity> memberEntityOptional = memberEntityRepository.findByMemberId( memberId );

        if(memberEntityOptional.isPresent()){
            MemberEntity memberEntity = memberEntityOptional.get();
            log.info(memberEntity+"");

            ApprovalEntity approvalEntity = approvalDto.toApprovalEntity();
            log.info("엔티티화되었는지");
            log.info(approvalEntity+"");


            approvalEntity.setMemberEntity(memberEntity);
            log.info("memberentity도 approvalentity에 저장되었는지");
            log.info(approvalEntity+"");
            log.info(approvalEntity.getMemberEntity().getMemberId()+"");


            int memberRank = getMember().getMemberRank(); //세션의 회원의 랭크 찾았음

            String status = "0";

            if(memberRank ==1){         //사원의경우
                status = "0" ;
            }else if(memberRank==2){    //주임
                status = "1" ;
            }else if(memberRank==3){    //대리
                status = "2" ;
            }else if(memberRank==4){    //과장
                status = "3" ;
            }else if(memberRank==5){    //차장
                status = "4" ;
            }else if(memberRank==6){    //부장
                status = "5" ;
            }else if(memberRank==7){    //팀장
                status = "6" ;
            }else if(memberRank==9){    //사장
                status = "7" ;
            }

            ApprovalEntity approvalEntity2 = approvalEntityRepository.save(approvalEntity);
            approvalEntity2.setApprovalStatus(status);

            log.info("memberentity2도 approvalentity에 저장되었는지");
            log.info(approvalEntity2+"");

            if(approvalEntity2.getApprovalNo() >=1 ){
                return true;
            }

        }
        return false;
    }

    /*수락버튼클릭
    @Transactional
    public boolean print(@RequestParam int approvalNo) {
        log.info("s accept::::approvalNo:::" + approvalNo);
        boolean result = approvalEntityRepository.update(approvalNo);
        log.info("s accept result::::: " + result);
        return result;
    }
*/

    //해당게시물출력 [2023-05-15]
    @Transactional
    public ApprovalDto print(int approvalNo){
        Optional<ApprovalEntity>optionalApprovalEntity =
                    approvalEntityRepository.findPrint(approvalNo);

        if(optionalApprovalEntity.isPresent() ){
            ApprovalEntity approvalEntity = optionalApprovalEntity.get();
            ApprovalDto approvalDto = approvalEntity.approvalDto();
            int partNo= approvalDto.getPartNo();

            return approvalDto;
        }
        return null;
    }


    //*수락버튼클릭*//
    @Transactional
    public int accept(@RequestParam int approvalNo){
        log.info("s accept::::approvalNo:::"+approvalNo);
        int result = approvalEntityRepository.statusupdate(approvalNo);
        log.info("s accept result::::: "+result);

        return result;
    }

    //*반려버튼클릭*//
    @Transactional
    public int refuse(@RequestParam int approvalNo){
        log.info("s refuse::::approvalNo:::"+approvalNo);
        int result = approvalEntityRepository.statusrefuse(approvalNo);
        log.info("s refuse result::::: "+result);
        return result;
    }



    //서류 상태출력
    //STATUS 상태에따른 서류
    @Transactional
    public List<ApprovalDto> approvalDtoList( ){

        List<ApprovalDto>list = new ArrayList<>();

        int memberRank = getMember().getMemberRank(); //세션의 회원의 랭크 찾았음

        String status = "0";

        if(memberRank ==1){         //사원의경우
            status = "-1" ;
        }else if(memberRank==2){    //주임
            status = "0" ;
        }else if(memberRank==3){    //대리
            status = "1" ;
        }else if(memberRank==4){    //과장
            status = "2" ;
        }else if(memberRank==5){    //차장
            status = "3" ;
        }else if(memberRank==6){    //부장
            status = "4" ;
        }else if(memberRank==7){    //팀장
            status = "5" ;
        }else if(memberRank==9){    //사장
            status = "6" ;
        }


/*        if(memberRank == 3){ //대리일경우 [사원의 서류 열람 가능] 즉 approval_status값이 0일경우에만 보이는 것임
            status = "0" ;


        }else if( memberRank == 4){ //과장일경우 [대리가 승인한 경우의 서류 열람가능]
            status = "1" ;

        }else if( memberRank == 6){ //팀장일경우 [과장이 승인한 경우의 서류 열람가능]
            status= "2";

        }else if( memberRank == 9){ //사장일경우  즉 최종결제완료됨
            status="3";

        }*/

/*
        //partName 뽑아내기위한 작업 [2023-05-16]
        int memberNo = getMember().getMemberNo();
        log.info(memberNo+"");
        Optional<PartEntity> optionalPartEntity  = partEntityRepository.findPartName(memberNo);*/


        List<ApprovalEntity> approvalEntityList = approvalEntityRepository.findByWatch( status );
        //String statuss = (approvalEntityRepository.findByStatus(5)); // 멤버 pk를이용한  approval_status 찾음

        approvalEntityList.forEach((o)->{
            list.add(o.approvalDto());
        });
        return list;
    }



    //내가 쓴 서류 결제상태 출력 [2023-05-15 월 작업 ]
    @Transactional
    public List<ApprovalDto>myapprovalDtoList(){

        List<ApprovalDto>list = new ArrayList<>();
        List<ApprovalEntity>list1 = new ArrayList<>();

        int memberNO= getMember().getMemberNo(); //멤버넘버 빼내기

        log.info("memberNO확인::::"+memberNO);

        List<ApprovalEntity> approvalmyList = approvalEntityRepository.findMyapproval(memberNO);
        log.info("optionalapprovalmyList확인::::"+approvalmyList);

        if(approvalmyList.size()>0){
            approvalmyList.forEach((o)->{
                list.add(o.approvalDto());
            });
            return list;
        }else{
            return null;
        }
    }

    /*내가쓴 게시물 삭제*/
    @Transactional
    public int delete(int approvalNo){

        log.info("s accept::::approvalNo:::"+approvalNo);

        int result = approvalEntityRepository.approvalDelete(approvalNo);

        return result;
    }


/*
    //맴버랭크 빼내기 함수 + 성봉이랑 같이 함
    @Transactional
    public List<ApprovalDto> getUserRank() {
        char result= getMember().getMemberRank();

        log.info("s result "+result);
       //String result = approvalEntityRepository.getUserRank();
        log.info("getUserRank getUserRank() result ::: " + result);

        List<ApprovalDto> result = approvalService.approvalDtos();
        log.info("c result:::"+result);
        return result;
        return null;
    }
*/


/*
    //멤버랭크 꺼내기
    @Transactional
    public List<ApprovalDto> approvalDtos(){

        List<ApprovalDto>List = new ArrayList<>();

        List<ApprovalEntity> approvalEntities = approvalEntityRepository.findByRank(getMember().getMemberRank(), getMember().getPartEntity().getPartNo() ); // 랭크 빼는 함수 확인

        log.info("s approvalEntities"+approvalEntities);

        approvalEntities.forEach((o)->{
            List.add(o.approvalDto());
        });

        log.info(List+"");
        return List;
    }
*/








}//class e
