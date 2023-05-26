import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useSearchParams  } from 'react-router-dom';

import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import PartList from './PartList'
export default function BoardUpdate(props) {
    const [ searchParams , setSearchParams ] = useSearchParams();
    const [board , setBoard] = useState({});
    let [partNo , setPartNo] = useState(0);

    // 수정할 게시물 값 가져오기
    useEffect(()=>{
        axios.get("/board/getboard" , {params: {boardNo : searchParams.get("boardNo") }})
            .then((r)=>{
                console.log(r.data);
                setBoard(r.data);
                setPartNo(r.data.partNo);
            })
    } , [])

    // 부서 변경 함수
    const partChange = (partNo) =>{setPartNo(partNo);}

    // 제목 입력 이벤트
    const inputTitle =(e)=>{
        console.log(e.target.value);
        board.boardTitle = e.target.value;
        setBoard({...board})
    }
    // 내용 입력 이벤트
    const inputContent = (e)=>{
        console.log(e.target.value);
        board.boardContent = e.target.value;
        setBoard({...board})
    }

    // 수정 함수
    const onUpdate = ()=>{
    let info = {
        boardNo : board.boardNo,
        boardTitle : document.querySelector('#boardTitle').value,
        boardContent : document.querySelector("#boardContent").value,
        partNo : partNo
    }
    axios.put("/board" , info)
        .then(r=>{
            alert('수정 성공')
            window.location.href="/view/"+board.boardNo
        })
    }

    // 취소시 본인 게시물로 돌아오기
    const onCancel = ()=>{ window.location.href="/view/"+board.boardNo }

    return (<>
         <Container>
             <PartList partChange={ partChange } />
             <TextField fullWidth value={ board.boardTitle } onChange={ inputTitle } className="boardTitle"     id="boardTitle"  label="제목" variant="standard" />
             <TextField fullWidth value={ board.boardContent } onChange={ inputContent } className="boardContent"   id="boardContent" label="내용" multiline rows={10} variant="standard" />
             <Button variant="outlined" onClick={  onUpdate }> 수정 </Button>
             <Button variant="outlined" onClick={  onCancel }> 취소 </Button>
         </Container>
    </>)
}