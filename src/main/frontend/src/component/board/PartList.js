import React,{useState,useEffect} from 'react'
import axios from 'axios'

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function PartList(props){

    // 1. 부서 목록/리스트
    let [list , setList] = useState([]);
    useEffect(()=>{
        axios.get('/board/part/list')
            .then(r=>{setList(r.data)});
    },[])

    // 2. 선택된 부서
    const [part , setPart]=useState(0);
        const handleChange = (event)=>{
            setPart(event.target.value);
            props.partChange(event.target.value)
        };

    return(<>
        <Box sx={{ minWidth: 120 }}>
          <FormControl style={{width:'200px' , margin : '20px 0px'}}>
            <InputLabel id="demo-simple-select-label">부서</InputLabel>
            <Select value={part} label="부서" onChange={handleChange}>
                <MenuItem value={0}>전체보기</MenuItem>
                {  /* 서버로 부터 받은 파트 리스트를 반복해서 출력 */ }
                {
                    list.map((p)=>{
                        return <MenuItem value={p.partNo}>{p.partName}</MenuItem>
                    })
                }
            </Select>
          </FormControl>
        </Box>
    </>)
}