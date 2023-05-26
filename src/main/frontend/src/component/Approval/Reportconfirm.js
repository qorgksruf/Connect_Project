import React , { useState , useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Approval from './Approval'
/*--------------------table mui----------------*/
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

//----------------------------------------------//


/*서류결제상태확인페이지 */
export default function Reportconfirm( props ){

    //요청한 게시물 정보를 가지고 있는 리스트 변수[상태관리변수]
    const [ rows, setRows ]=useState( [] );


    //status에 따른 서류 출력 [2023-05-11 월 작업 ]
        const getUserRank = () => {
            axios.get('/approval/getUserRank').then(r => {
                  console.log(r);
                  console.log(r.data);
                  if(r.data == ""){
                        alert('결제할 서류가 없습니다')
                  }
                  setRows(r.data);

            })

        }

        //결제상태확인하기
        const getUserState = ( state ) => {
                console.log( state );
                if(state == '0'){
                    return '주임결제대기중'
                }else if(state == '1'){
                    return '대리결제대기중'
                }else if(state == '2'){
                    return'과장결제대기중'
                }else if(state == '3'){
                    return'차장결제대기중'
                }else if(state == '4'){
                    return'팀장결제대기중'
                }else if(state == '5'){
                    return'부장결제대기중'
                }else if(state == '6'){
                    return'최종결제대기중'
                }else if(state == '7'){
                    return'최종결제완료'

                }else if(state == '9'){
                    return'반려'
                }
         }

    //서류상태확인
    return(<>
            <Container>
                 <h3>서류결제창</h3>
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell align="center" style={{width:'10%'}} >번호</TableCell>
                                <TableCell align="center" style={{width:'10%'}} >부서</TableCell>
                                <TableCell align="center" style={{width:'10%'}} > 제목</TableCell>
                                <TableCell align="center" style={{width:'10%'}} >작성자</TableCell>
                                <TableCell align="center" style={{width:'10%'}} >작성일</TableCell>
                                <TableCell align="center" style={{width:'10%'}} >결제상태</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map((row) => (
                                <TableRow
                                  key={row.approvalNo}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell align="center" scope="row"> {row.approvalNo} </TableCell>
                                  <TableCell align="center"> {row.partName}</TableCell> {/*수정필요 계속 null값이 뜸 [ 2023- 05 -15] */}
                                  <TableCell align="center"> <a href={"/approval/view/"+row.approvalNo}> {row.approvalTitle} </a> </TableCell>
                                  <TableCell align="center">{row.approvalWriter}</TableCell>
                                  <TableCell align="center">{row.approvalData}</TableCell>
                                  <TableCell align="center">{getUserState(row.approvalStatus)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
            </Container>
        <button  onClick={getUserRank} type="button">결제할서류보기</button>

    </>)
}