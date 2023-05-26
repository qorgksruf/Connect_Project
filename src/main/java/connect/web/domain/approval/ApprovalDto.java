package connect.web.domain.approval;


import connect.web.domain.member.MemberEntity;
import lombok.*;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDate;


@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApprovalDto {

    private int approvalNo;          //결재
    private String approvalWriter;   //신청자
    private String approvalTitle;    //제목
    private String approvalContent;  //내용
    private String approvalStatus;   //결재단계
    private String approvalData;     //결재날짜
    private int memberNo;
    private int memberRank;
    private int partNo;
    private String partName;         //부서명


    //Dto-> entity하기 (DB 저장용) => { 작성자, 제목, 내용, 결제단계 }
    public ApprovalEntity toApprovalEntity(){
        return ApprovalEntity.builder()
                .approvalWriter(this.approvalWriter)
                .approvalTitle(this.approvalTitle)
                .approvalData(this.approvalData)
                .approvalContent(this.approvalContent)
                .build();

    }

}
