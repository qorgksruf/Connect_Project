/* 김동혁 임시 파일임 */
import React,{useState,useEffect,useRef} from 'react'
import axios from 'axios'
export default function PartBoard(props){
    const setPart = () =>{ console.log('setPart')
        let partName = document.querySelector('.partName');
        axios.post('/board/part/write' , {"partName" : partName.value})
            .then((r)=>{
                if(r.data==true){alert('등록 성공'); partName.value = ''}
            })
    }
    return(<>
        <h3>임시 부서등록 페이지</h3>
        <input type="text" className="partName" />
        <button onClick={setPart} type="button"> 부서 등록 </button>
    </>)
}