import React , { useState , useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useParams}from 'react-router-dom';
import styles from '../css/Approval/paper.css';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    Paper , Container
} from '@mui/material'

import CheckIcon from '@mui/icons-material/Check';


export default function ViewA(props){
    /*결제전  서류  내용 마이 페이지*/
    const params = useParams();
    console.log(params);
    console.log(params.approvalNo);

    //해당게시물의 서류내용출력 [2023-05-18]
    const [approval , setApproval] = useState({});


    //1.해당게시물의 서류내용출력 [2023-05-18]
    const getPrint = ()=>{
        axios.get('/approval/getPrint',{ params :{approvalNo:params.approvalNo} })
            .then( (r) =>{
                console.log(r);
                console.log(r.data);
                setApproval(r.data);

            })

    }
    //1.처음 열렸을때 렌더링
    useEffect(()=>{getPrint();},[])


    /*직위*/
    const abc = (value) => {
            if( value == 1 ){
                    return '사원';
                }else if(value == 2) {
                    return '주임';
                }else if(value == 3) {
                    return '대리';
                }else if(value == 4 ){
                    return '과장';
                }else if(value == 5 ){
                    return '차장';
                }else if(value == 6) {
                    return '팀장';
                }else if(value == 7){
                    return '부장';
                }else if( value == 9 ){
                    return '사장';
                }else{
                    return '슈퍼관리자'
                }

            }


    /*삭제버튼 클릭시[2023-05-23]*/
    const Noapproval = () =>{
        console.log("삭제버튼");

        let deleteConfirm = window.confirm("선택된 결제서류가 삭제됩니다, 삭제하시겠습니까?");
        axios.delete('/approval/delete',{ params :{approvalNo:params.approvalNo} })
            .then( (r) =>{
                console.log(r);
                console.log(r.data);
                if(r.data == 1){
                    alert('삭제성공')
                    window.location.href='/home';
                }else{
                    alert('삭제실패')
                }
            })

    }



    return(<>
        <Container>
            <Paper elevation={3} className="approval-wrap">
            <Container>
                 <div className="main-title">
                    <h3> {approval.approvalTitle} </h3>
                 </div>
                    <div className="top-title">
                        <div className="approval-member">
                            <table className="approval-table">
                                <tr>
                                    <th rowSpan="2"> 결재 </th>
                                    <th> 주임 </th>
                                    <th> 대리 </th>
                                    <th> 과장 </th>
                                    <th> 차장 </th>
                                    <th> 팀장 </th>
                                    <th> 부장 </th>
                                    <th> 이사 </th>
                                </tr>

                                <tr>
                                     <td>  { approval.approvalStatus > 0 ? <CheckIcon/> : "" } </td>
                                     <td>  { approval.approvalStatus > 1 ? <CheckIcon/> : "" } </td>
                                     <td>  { approval.approvalStatus > 2 ? <CheckIcon/> : "" } </td>
                                     <td>  { approval.approvalStatus > 3 ? <CheckIcon/> : "" } </td>
                                     <td>  { approval.approvalStatus > 4 ? <CheckIcon/> : "" } </td>
                                     <td>  { approval.approvalStatus > 5 ? <CheckIcon/> : "" } </td>
                                     <td>  { approval.approvalStatus > 6 ? <CheckIcon/> : "" } </td>
                                </tr>
                            </table>
                        </div>
                  </div>

                        <div className="acontent-box">
                            <table className="acontent">
                                <tr>
                                    <th className="apart">부서</th>
                                        <td> {approval.partName} </td>
                                    <th className="apart">직급</th>
                                        <td> { abc(approval.memberRank) }</td>
                                </tr>

                                <tr>
                                    <th className="apart">성명</th>
                                        <td id="approvalWriter"> {approval.approvalWriter} </td>
                                    <th className="apart">비상연락망</th>
                                        <td> sdfsdf </td>
                                </tr>

                                <tr>
                                    <th className="apart">구분</th> <td colSpan="3">
                                         {approval.approvalTitle} </td>
                                </tr>

                                <tr>
                                    <th className="apart">휴가기간</th>
                                    <td colSpan="3" className="approvalData" id="approvalData">
                                            {approval.approvalData}
                                    </td>
                                </tr>

                                <tr>
                                    <th className="adetail">세부사항</th>
                                        <td colSpan="3">
                                           {approval.approvalContent}
                                        </td>
                                </tr>
                            </table>
                        </div>

                        <div className="acomment">
                            <h3> 위와 같이 휴가를 신청하오니 허락하여 주시기 바랍니다. </h3>
                        </div>
                        <div className="adate">
                            <h3> 2023년&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5월&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25일 </h3>
                                <Button onClick={ Noapproval }> 삭제하기 </Button>
                        </div>
                </Container>
            </Paper>
        </Container>
    </>)

}