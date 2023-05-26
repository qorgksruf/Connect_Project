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

export default function Myapproval(props) {

        const [ myrows,setMyrows ] = useState([]);


        //내가 쓴 서류 결제상태 출력 [2023-05-15 월 작업 ]
        const getMyprint = () => {
             axios.get('/approval/getMyprint').then(r => {
                    console.log(r);
                    setMyrows(r.data);
             })
        }

        //1.처음 열렸을때 렌더링
        useEffect(()=>{getMyprint();
        },[])



        //결제상태확인하기
        const getUserState = ( state ) => {
                console.log( state );
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



        return(<>
            <Container>
                 <h3>내 서류 결제상태확인 페이지</h3>
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell align="center" style={{width:'10%'}} >번호</TableCell>
                                <TableCell align="center" style={{width:'10%'}} >부서</TableCell>
                                <TableCell align="center" style={{width:'10%'}} >제목</TableCell>
                                <TableCell align="center" style={{width:'10%'}} >작성자</TableCell>
                                <TableCell align="center" style={{width:'10%'}} >작성일</TableCell>
                                <TableCell align="center" style={{width:'10%'}} >결제상태</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {myrows.map( (row) => (
                                <TableRow
                                  key={row.approvalNo}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell align="center" scope="row"> {row.approvalNo} </TableCell>
                                  <TableCell align="center"> {row.partName}</TableCell>
                                  <TableCell align="center"> <a href={"/approval/viewB/"+row.approvalNo}> {row.approvalTitle} </a> </TableCell>
                                  <TableCell align="center">{row.approvalWriter}</TableCell>
                                  <TableCell align="center">{row.approvalData}</TableCell>
                                  <TableCell align="center">{ getUserState(row.approvalStatus) } </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
            </Container>

        </>)

}