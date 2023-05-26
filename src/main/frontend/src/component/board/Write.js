import React,{useState,useEffect} from 'react'
import axios from 'axios'
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import PartList from './PartList'

export default function Write(props) {

    // 1. 게시물 쓰기
    const setBoard = () =>{
        let info = {
            boardTitle : document.querySelector("#boardTitle").value,
            boardContent : document.querySelector("#boardContent").value,
            partNo : partNo
        }
        console.log(info)
            axios.post('/board',info)
                .then(r=>{
                    console.log(r);
                    if(r.data==1){alert('부서 선택 후 작성 가능[전체보기 제외]')}
                    else if( r.data == 2 ){ alert('게시물작성실패[ 로그인 후 작성 가능]'); }
                    else if( r.data == 3 ){ alert('게시물작성성공'); window.location.href="/list"}
                })
    }
    // 1-1 게시글쓰기 취소
    const cancelSetBoard = () =>{
        window.location.href="/list";
    }

    // 부서 선택
    let [partNo,setPartNo] = useState(0);
    const partChange = (partNo) =>{setPartNo(partNo);}
    return (<>
        <Container>
            <PartList partChange={partChange} />
            <TextField fullWidth className="boardTitle"     id="boardTitle" label="제목" variant="standard" />
            <TextField fullWidth className="boardContent"   id="boardContent" label="내용" multiline rows={10} variant="standard"/>
            <Button variant="outlined" onClick={setBoard}> 등록 </Button>
            <Button variant="outlined" onClick={cancelSetBoard}> 취소 </Button>
        </Container>
    </>)

}