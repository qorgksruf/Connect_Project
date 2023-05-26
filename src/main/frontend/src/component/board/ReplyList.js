import React,{useState,useEffect} from 'react'
import axios from 'axios'

import styles from '../css/board/List.css'

export default function ReplyList(props) {

    const [ login , setLogin ] = useState( JSON.parse( sessionStorage.getItem('login_token') ) )


    // [김동혁]댓글 작성 핸들러
    const onWriteHandler = ()=>{
        console.log(document.querySelector('.replyContent').value );
        props.onReplyWrite(document.querySelector('.replyContent').value);
    }

    // [김동혁]댓글 수정 핸들러
    const onUpdateHandler = (e , replyNo)=>{
        console.log('수정할 댓글 번호'+replyNo);
        props.onReplyUpdate(document.querySelector('.replyUpdateContent'+replyNo).value,replyNo);
        document.querySelector('.replyUpdateContent'+replyNo).value = '';
        document.querySelector('.upDelBox'+replyNo).style.display = 'none'
    }
    console.log( props );

    // [김동혁] 댓글 삭제 핸들러
    const onDeleteHandler = (e, replyNo)=>{
        console.log('삭제할 댓글 번호 : ' +replyNo);
        props.onReplyDelete(replyNo);
    }
    // [김동혁] 수정,삭제칸 보이기
    const upDelBoxLook=(e, replyNo)=>{
        document.querySelector('.upDelBox'+replyNo).style.display == 'none' ?
        document.querySelector('.upDelBox'+replyNo).style.display = 'block' :
        document.querySelector('.upDelBox'+replyNo).style.display = 'none'

    }


    return (<>
    <div className="replyContainer">
        <div className="replyInput">
            <div className="replyContentArea">
                <textarea className="replyContent" type="text"/>
            </div>
            <div>
                <button className="viewReplyBtn" onClick={onWriteHandler}> 댓글작성 </button>
            </div>
        </div>
        <div className="replyArea">
                {   props.replies.map( (r)=>{
                        return (<div className="reply">
                                    <div className="replyHeader">
                                        <div className="replyWriter">{r.memberName}</div>
                                        <div>{ (login != null && login.memberNo == r.memberNo) ?
                                            <>
                                                <button className="replyUpDel" onClick={(e) => upDelBoxLook(e, r.replyNo)}> ··· </button>
                                            </> :
                                            <></> }
                                        </div>
                                    </div>
                                        <div>
                                            <div className="replyDetail">
                                                {r.replyContent}
                                            </div>
                                            <div className={"upDelBox"+(r.replyNo)} style={{display:'none'}}>
                                                <input className={ 'replyUpdateContent'+(r.replyNo) } type="text" />
                                                <button className="replyUpDelBtn" onClick={(e)=>onDeleteHandler(e,r.replyNo)}>삭제</button>
                                                <button className="replyUpDelBtn" onClick={(e)=>onUpdateHandler(e,r.replyNo)}>수정</button>
                                            </div>
                                        </div>
                                        <div className="replyDate">
                                            {r.replyDate}
                                        </div>
                                </div>)
                    })
                }
            </div>
        </div>
    </>)
}