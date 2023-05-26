import React , { useState , useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import styles from '../css/Approval/paper.css';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    Paper , Container
} from '@mui/material'

import CheckIcon from '@mui/icons-material/Check';

/*휴가계작성 페이지*/
export default function Approval( props ){


    const [value,setValue] = useState({});


    let dateTime = value["$y"] + "-" + (value["$M"]+1) + "-" + value["$D"] ;

    //let [list,setList] = useState([]);
    //휴가게 쓰기
    const setApproval = () => {
        let info = {
            approvalWriter: session.memberName,
            approvalTitle: document.querySelector('#approvalTitle').value,
            approvalContent: document.querySelector('#approvalContent').value,
            approvalData: dateTime
        }

        console.log( info );

        axios.post('/approval/awrite', info ).then( r => {
            console.log(r);
            if(r.data == true){
                alert('게시물작성성공');
                window.location.href='/home';
            }
        })
    }

    let session = JSON.parse(sessionStorage.getItem('login_token'));
    console.log(session.memberId);


        //직급
        const getUserState = ( state ) => {
                console.log( state );
                    if( state == 1 ){
                        return '사원';
                    }else if(state == 2) {
                        return '주임';
                    }else if(state == 3) {
                        return '대리';
                    }else if(state == 4 ){
                        return '과장';
                    }else if(state == 5 ){
                        return '차장';
                    }else if(state == 6) {
                        return '팀장';
                    }else if(state == 7){
                        return '부장';
                    }else if( state == 9 ){
                        return '사장';
                    }else{
                        return '슈퍼관리자'
                    }
         }

    return(<>
        <Container>
            <Paper elevation={3} className="approval-wrap">
                <Container>
                     <div className="main-title">
                          <h3> 결  제  신  청  서 </h3>
                     </div>
                        <div className="top-title">
                            <div className="approval-member">
                                <table className="approval-table">
                                <tr>
                                    <th rowSpan="2"> 결재 </th>
                                    <th> 주임 </th>
                                    <th> 대리 </th>
                                    <th> 과장 </th>
                                    <th> 부장 </th>
                                    <th> 차장 </th>
                                    <th> 팀장 </th>
                                    <th> 부장 </th>
                                    <th> 이사 </th>
                                </tr>

                                <tr>
                                     <td>  </td>
                                     <td>  </td>
                                     <td>  </td>
                                     <td>  </td>
                                     <td>  </td>
                                     <td>  </td>
                                     <td>  </td>
                                     <td>  </td>
                                </tr>
                                </table>
                            </div>
                        </div>

                        <div className="acontent-box">
                            <table className="acontent">
                                <tr>
                                    <th className="apart">부서</th> <td> {session.partName} </td> <th className="apart">직급</th> <td> {getUserState(session.memberRank)} </td>
                                </tr>

                                <tr>
                                    <th className="apart">성명</th> <td id="approvalWriter"> {session.memberName} </td>
                                    <th className="apart">비상연락망</th> <td> {session.memberPhone} </td>
                                </tr>

                                <tr>
                                    <th className="apart">구분</th> <td colSpan="3"> <input type="text" class="approvalTitle" id="approvalTitle" /> </td>
                                </tr>

                                <tr>
                                    <th className="apart">휴가기간</th>
                                    <td colSpan="3" className="approvalData" id="approvalData">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                          <DatePicker
                                          value={value}
                                          onChange={(newValue) => setValue(newValue)}
                                          />
                                        </LocalizationProvider>
                                    </td>
                                </tr>

                                <tr>
                                    <th className="adetail">세부사항</th>
                                        <td colSpan="3">
                                            <input type="textarea" className="approvalContent" id="approvalContent"/>
                                        </td>
                                </tr>
                            </table>
                        </div>

                        <div className="acomment">
                            <h3> 위와 같이 휴가를 신청하오니 허락하여 주시기 바랍니다. </h3>
                        </div>
                        <div className="adate">
                            <h3> 2023년&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5월&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25일 </h3>
                                <Button variant="outlined" onClick={ setApproval }> 작성 </Button>
                                <setApproval/>
                                <Button variant="outlined"> 취소 </Button>
                        </div>
                </Container>
            </Paper>
        </Container>

    </>)



}

{
/*

    <TextField fullWidth className="approvalWriter" id="approvalWriter" label="작성자" variant="standard" />
    <TextField fullWidth className="approvalTitle"   id="approvalTitle" label="제목" variant="standard" />

    <TextField fullWidth className="approvalContent" id="approvalContent"
              label="내용"
              multiline
              rows={5}
              variant="standard"
    />
    <TextField fullWidth className="approvalData" id="approvalData" label="날짜" variant="standard" />
    <Button variant="outlined" onClick={ setApproval }> 작성 </Button>
    <setApproval/>
    <Button variant="outlined"> 취소 </Button>
    <div>

    </div>
</Container>


        <span className="wave"> ~ </span>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker />
    </LocalizationProvider>


*/
}