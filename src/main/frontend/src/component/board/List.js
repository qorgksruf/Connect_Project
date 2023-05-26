import React , { useState , useEffect } from 'react';
import axios from 'axios';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import Pagination from '@mui/material/Pagination';

import PartList from './PartList';

import styles from '../css/board/List.css'

export default function List(props) {

    // 게시물들의 정보 변수
    let [rows,setRows]=useState([])
    let [pageInfo,setPageInfo]=useState({'partNo' : 0 , 'page' : 1 , 'key' : '' , 'keyword' : '' })
    let [totalPage , setTotalPage] = useState(1);

    // 서버에 요청하기(백엔드에 요청하기)
    useEffect(()=>{
        axios.get('/board' , {params : pageInfo})
            .then(r=>{ console.log(r); console.log(r.data);
                setRows(r.data.boardDtoList)
                setTotalPage(r.data.totalPage)
            })
    },[pageInfo]) // pageInfo(partNo , page , 검색 ) 변경될때마다 useEffect 실행된다.

    // 부서 변경
    const partChange = (partNo) =>{
        pageInfo.partNo = partNo;   // 부서 교체시 부서 번호 가져와서 변수에 대입
        setPageInfo({...pageInfo});
    }

    // 페이징 처리
    const selectPage = (event,value) =>{ console.log(value);
        pageInfo.page = value;  // 버튼 교체시 페이지 번호 가져와서 변수에 대입
        setPageInfo({...pageInfo})
    }

    // 검색처리
    const onSearch = ()=>{
        pageInfo.key = document.querySelector('.key').value
        pageInfo.keyword = document.querySelector('.keyword').value
        pageInfo.page=1 // 검색 시 첫 페이지로 이동
        setPageInfo({...pageInfo}) // 검색 후 렌더링
    }

    return(
    <Container>
        <div style={{display : 'flex' , justifyContent:'space-between' , alignItems:'center'}}>
            <PartList partChange={partChange} />
            <div className="searchBox">
                <select className="key">
                    <option value="boardTitle">제목</option>
                    <option value="boardContent">내용</option>
                </select>
                <input type="text" className="keyword"/>
                <button type="button" onClick={onSearch} variant="outlined"> 검색 </button>
            </div>
        </div>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableCell align="center" style={{width:"10%"}}> 글 번호 </TableCell>
                    <TableCell align="center" style={{width:"10%"}}> 작성일 </TableCell>
                    <TableCell align="center" style={{width:"10%"}}> 카테고리 </TableCell>
                    <TableCell align="center" style={{width:"50%"}}> 제목 </TableCell>
                    <TableCell align="center" style={{width:"10%"}}> 작성자 </TableCell>
                    <TableCell align="center" style={{width:"10%"}}> 조회수 </TableCell>
                </TableHead>
                <TableBody>
                    {rows.map((row)=>(
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row"> {row.boardNo} </TableCell>
                            <TableCell align="center"> {row.boardDate} </TableCell>
                            <TableCell align="center"> {row.partName} </TableCell>
                            <TableCell align="center"> <a href={'/view/'+row.boardNo }> {row.boardTitle} </a> </TableCell>
                            <TableCell align="center"> {row.memberName} </TableCell>
                            <TableCell align="center"> {row.boardView} </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <div style={{ display:'flex' , justifyContent:'center' , margin: '30px 0 0 0px' , alignItems:'center'}}>
            <div>
                <Pagination count={totalPage} color="primary" onChange={selectPage} />
            </div>
            <div>
                <a href="/write"><button className="writeBtn" variant="outlined">게시물 작성</button></a>
            </div>
        </div>
    </Container>
    )
}