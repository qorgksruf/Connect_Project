package connect.web.domain.approval;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import connect.web.domain.member.MemberEntity;
import connect.web.domain.member.PartEntity;
import lombok.*;

import javax.persistence.*;
import java.time.format.DateTimeFormatter;
import java.util.Date;
@Entity
@Data @AllArgsConstructor @NoArgsConstructor
@Builder
@Table( name = "approval")
public class ApprovalEntity {


    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int approvalNo; //결재

    @Column(nullable = false) private String approvalWriter;    //신청자
    @Column(nullable = false) private String approvalTitle;     //제목
    @Column(nullable = false) private String approvalContent;   //내용
    @Column @Builder.Default private String approvalStatus = "0";   //결재상태[0:대기중 1:대리승인완료 2:과장승인완료 3:팀장승인완료(최종) 9:반려]
    @Column private String approvalData;
    /*    @Column(name = "DATE_FIELD")
    @Temporal(TemporalType.DATE)
    private java.util.Date approvalData;      //결재날짜*/


    @ManyToOne
    @JoinColumn( name = "memberNo")
    @ToString.Exclude
    private MemberEntity memberEntity;

    private String partName;
    private int partNo;


/*
    @ManyToOne
    @JoinColumn( name = "memberNo")
    @ToString.Exclude
    private MemberEntity memberEntity;*/

    //Entity -> Dto하기 (출력용) => {결재pk번호, 작성자, 제목, 내용, 결재단계, 날짜}

    public  ApprovalDto approvalDto(){
        return ApprovalDto.builder()
                .approvalNo(this.approvalNo)
                .approvalWriter(this.approvalWriter)
                .approvalTitle(this.approvalTitle)
                .approvalContent(this.approvalContent)
                .approvalStatus(this.approvalStatus)
                .approvalData(this.approvalData)
                .memberRank(this.memberEntity.getMemberRank())
                .memberNo(this.memberEntity.getMemberNo())
                .partName(this.partName)
                .partNo(this.partNo)
                .build();

    }


}