import React , { useState , useEffect , useRef } from 'react';
import axios from 'axios';
//   implementation 'org.springframework.boot:spring-boot-starter-websocket' //web 소켓 builder

export default function Messenger(props){
// ------------------------------- 변수 ---------------------------------
    //0. 로그인 객체 정보
   	const member = props.member;
    //1.메세지 보내기 DOM
    let msgInput = useRef(null);
    //2-2. 현재 채팅방 전체 메세지
   	const [msgContent, setMsgContent ] = useState([]);
    //3. 소켓
    let ws = useRef( null );
    //4. 파일보내기
    let fileForm = useRef(null); // Form
    let fileInputClick= useRef(null); // input file 작동용 (none 처리함)
    //5.메세지 수정 및 삭제 용
    const [messageId , setMessageId] = useState(0)
    //6. 메세지 수정용
    const [editMessage , setEditMessage ] = useState(false);


    // 채팅방 회원
    const [inMember , setInMember] = useState([]);
    // 멤버 이미지
    const [ imageUrl , setImageUrl ] = useState("");

//--------------------------------- 함수 --------------------------------
/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 메세지 보내기 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/
    //1-1. 메세지 보내기 (소켓)
    useEffect( () => {
        if(!ws.current){//만약 클라이언트소켓이 접속이 안되어 있을때
             ws.current = new WebSocket("ws://192.168.17.34:80/chat2");
             ws.current.onopen = () => {}
             //4. 나갈때
             ws.current.onclose = (e) => {}
             //5. 오류
             ws.current.onerror = (e) => {}
             //6. 받을때 메세지 업데이트
             ws.current.onmessage = (e) => {printMessages( e.data)}
        }
    })

    //1-2. 메세지 보내기 (DB)
    const sendMessages = () =>{
        let chatMessagesDto = {
            content: msgInput.current.value,    memberNo: member.memberNo,
            chatRoomId: props.roomId,           msgType: "msg"
        }

        // 메세지 내용이 있으면 메시지 전송
        if( chatMessagesDto.content != ''){
            axios.post('/chat/message', chatMessagesDto)
                            //메세지 출력 함수 (채팅방 ID) ; 메세지입력창 초기화
                 .then(r=>{ printMessages ( props.roomId ); msgInput.current.value=""; })
        } //메세지 전송후 메세지 내용 초기화
         chatMessagesDto.content = '';

        if(fileInputClick.current.value != ''){//첨부파일 존재시
            let formData = new FormData( fileForm.current )
            formData.set( 'chatRoomId' , props.roomId ); formData.set( 'memberNo' , member.memberNo )
            axios.post('/chat/fileUpload' , formData )
                             //메세지 출력 함수 (채팅방 ID) ; 파일창 초기화
                  .then(r=> {printMessages ( props.roomId ); fileInputClick.current.value=''; })
        }
    }

/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 메세지 출력하기 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/

    //2-2. 채팅방 클릭시+입력받을시 메세지 출력
    useEffect(()=>{ printMessages(props.roomId); },[props.roomId])

    //2-3. 메세지 출력하기
    const printMessages = ( chatRoomId) => {
        axios.get("/chat/message", {params:{"chatRoomId":chatRoomId}})
            .then(r=>{setMsgContent(r.data); in_Member(chatRoomId);  })
    }

/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 메세지 수정,삭제 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/
	//3. 메세지 우클릭시 수정,삭제창 보이게
     const show_menu2=(e,chatMessagesId)=>{
        e.preventDefault(); //기존 우클릭 이벤트 제거
        //현재 우클릭한 메세지를 제외한 나머지 모두 none
        document.querySelectorAll('.messages_menu').forEach((o)=>{  o.style.display='none'; })
        let x = e.pageX + 'px'; /* 현재 마우스의 X좌표 */ let y = e.pageY + 'px'; // 현재 마우스의 Y좌표
        const message_num = document.querySelector('.messages_num_'+chatMessagesId);
        message_num.style.left = x; message_num.style.top = y; message_num.style.display = 'block';
        setMessageId(chatMessagesId); //어떤 채팅방을 클릭했는지 알려주기
     }

    //3-1. 아무곳이나 클릭시 우클릭 메뉴 숨기기
     const hide_menu2 = ((e) => {
         document.querySelectorAll('.messages_menu').forEach((o)=>{  o.style.display='none'; })
     });

     //3-2. 수정클릭시 메세지 수정모드
     const edit_message = ((chatMessagesId)=>{
        //수정창 보이게
        setEditMessage(true); setMessageId(chatMessagesId)
        //db에서 수정할 메세지의 원본은 가져옴
        axios.get("/chat/oneMessage",  {params:{"chatMessagesId":chatMessagesId}} )
            .then(r=>{msgInput.current.value=r.data.content}) //현재 채팅메세지 입력창에 수정할 메세지내용 대입
     })


     //3-3. 메세지 수정버튼 누를시
     const edit_Message_btn = (()=>{
        let chatMessagesDto = { "chatMessagesId":messageId, "content":msgInput.current.value  }
        axios.put("/chat/message",  chatMessagesDto )           //send chat room        //변경시 모달창닫기, 채팅창 업뎃
             .then(r=> { if(r.data==true){ alert('수정 완료!.');
             setEditMessage(false); msgInput.current.value=""; printMessages( props.roomId ); }
                        else{alert('오류!')}  } )
     })


     //4. 메세지 삭제
     const del_message = ((chatMessagesId)=>{
        axios.delete("/chat/message", {params:{"chatMessagesId":chatMessagesId }})
            .then(r=>{  if(r.data==true){alert('삭제 되었습니다.'); printMessages(props.roomId);}
                        else{alert('오류!') } } )
     })


    //4. 렌더링 할때마다 스크롤 가장 하단으로 내리기
    useEffect ( () => {
    document.querySelector('.in_chat_room').scrollTop=
        document.querySelector('.in_chat_room').scrollHeight;
    },[msgContent])

    //5. 버튼클릭시 input태그에 클릭이벤트를 걸어준다.
    const fileUpload = () => {fileInputClick.current.click();};


    /* --------------------------------- 채팅방 회원 이미지 출력 ---------------------------------------------------*/
    //1. 현재 DB에 초대된 멤버 불러오기
    const in_Member = (chatRoomId) => {
        axios.get("/chat/inMember", {params:{chatRoomId:chatRoomId}})
             .then(r=>{ setInMember(r.data);  })
    }

    //2. 멤버별 이미지 불러오기
    useEffect ( () => {memberImg()} , [inMember]);

    const memberImg = () => {
        inMember.forEach((o)=>{
            getProfileImg(o);
        })
    }

    // 프로필 이미지 가져오기
    const getProfileImg = ( inMember ) => {
        if( inMember.uuidFilename == null ){inMember.uuidFilename = 'default.png' ;}

        // 서버로부터 이미지를 찾아 Blob 으로 가져오기
        axios({
                url: `/image/${inMember.uuidFilename}`,  // 이미지 파일 이름을 포함한 API 엔드포인트
                method: 'GET',
                responseType: 'arraybuffer',   // 바이너리 데이터로 받기 위해 responseType을 설정

            }).then(response => {

                const contentType = response.headers['content-type']; // 응답받은값의 헤더에 컨텐츠타입을 호출 // 예) : 'image/png'

                const imageBlob = new Blob([response.data], { type: contentType });  // 바이너리 데이터를 Blob 객체로 변환
                const imageUrl = URL.createObjectURL(imageBlob ) ;  // Blob URL을 생성하여 이미지를 렌더링할 수 있는 URL을 만듦

                setImageUrl( imageUrl ); // 상태변수에 Blob 경로 대입
                inMember.uuidFilename = imageUrl
        }).catch(error => {
            console.error(error);
        });
    }


    return (<>
                {/*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 중앙 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/}
                <div className="center" onClick={hide_menu2}>
                    {/*  --------------------- 채팅방 이름 ------------------------ */}
                    <div className="header">
                        <span className="chat_name center_chat_name"> {/* 부모의 클릭한 채팅방 배열을 가져옴 */}
                            {props.nowRoom != undefined || props.nowRoom != null ?
                             props.nowRoom.name : '' }
                        </span>
                    </div>

                    {/*  --------------------- 채팅방 메세지 ------------------------ */}
                    <div className="in_chat_room">
                    {   /* 내가아닌 메세지는 왼쪽으로, 내가보낸 메세지는 오른쪽으로 */
                         msgContent.map((o)=>{
                            {
                                if(o.memberNo != member.memberNo ){
                                        return(<>
                                            <div className="your_message messagebox">
                                                <div className="profile">
                                                    <div className="message_name"> {o.memberName} </div>
                                                    <div className="profile_img">
                                                        {/*채팅방 회원 전체조회후 일치시 이미지 출력*/}
                                                        { inMember.map((member)=>{
                                                            if(o.memberNo == member.memberNo){
                                                                return(<>
                                                                    <img src={""+member.uuidFilename}/>
                                                                </>)
                                                            }
                                                            })
                                                        }
                                                    </div>
                                                </div> {/* profile e*/}
                                                {o.msgType == 'msg' ?
                                                <div className="message"> {o.content} </div> :
                                                <div className="message">
                                                    <div className="message_img">
                                                        <img src={"http://192.168.17.34:80/static/media/"+o.uuidFile}/>
                                                    </div>
                                                    <span className="img_name"> {o.originalFilename} </span>
                                                    <span className="img_downLoad">
                                                        <a href={"/chat/fileDownload?uuidFile=" + o.uuidFile } > 저장 </a>
                                                    </span>
                                                </div>
                                                }

                                                <div className="message_cdate"> {o.cdate} </div>
                                            </div>
                                        </>);

                               }else if( o.memberNo == member.memberNo ){
                                        return(<>
                                             <div className="me_message messagebox">
                                                 <div className="message_cdate"> {o.cdate} </div>

                                                {o.msgType == 'msg' ?
                                                <div className="message" onContextMenu={(e)=>show_menu2(e,o.chatMessagesId)} //우클릭 이벤트
                                                > {o.content} </div> :
                                                <div className="message" onContextMenu={(e)=>show_menu2(e,o.chatMessagesId)} //우클릭 이벤트
                                                >
                                                    <div className="message_img">
                                                        <img src={"http://192.168.17.34:80/static/media/"+o.uuidFile}/>
                                                    </div>
                                                    <span className="img_name"> {o.originalFilename} </span>
                                                    <span className="img_downLoad">
                                                        <a href={"/chat/fileDownload?uuidFile=" + o.uuidFile } > 저장 </a>
                                                    </span>
                                                </div>
                                                }
                                                 <div className="profile">
                                                     <div className="message_name"> {o.memberName} </div>
                                                     <div className="profile_img">
                                                        { inMember.map((member)=>{
                                                            if(o.memberNo == member.memberNo){
                                                                return(<>
                                                                    <img src={""+member.uuidFilename}/>
                                                                </>)
                                                            }
                                                            })
                                                        }
                                                     </div>
                                                 </div>
                                             </div>

                                             {/* 우클릭시 채팅방 수정 삭제 리스트가 보입니다.*/}
                                             <ul className={"messages_menu messages_num_"+o.chatMessagesId}>
                                               <li onClick={(e)=> edit_message(o.chatMessagesId)} > 메세지 수정 </li>
                                               <li onClick={(e)=> del_message(o.chatMessagesId)}> 메세지 삭제 </li>
                                             </ul>
                                        </>)
                               }
                            }
                        })
                    }
                    </div>

                    {/* --------------------- 메세지 입력 창 ------------------------ */}
                    { /* 채팅방을 클릭하지않으면 메세지 입력창이 보이지 않습니다. */
                    props.roomId != 0 ?
                    <>
                    <div className="message_edit_box" style={editMessage ? {display:'block'} : {display:'none'} }> 메세지 수정중  </div>
                    <div className="message_send_box">
                        <div className="file">
                          <div className="btn-upload" onClick={fileUpload}>파일 </div>
                        </div>
                        <form ref={fileForm}>
                            <input  ref={fileInputClick} type="file" name="files" id="file" multiple={true}   />
                        </form>
                        <input type="text" className="message_input" ref={msgInput} />
                        {   /* 수정창을 누르면 버튼이 수정버튼으로 바뀝니다.*/
                        editMessage == true ?
                        <button type="button" className="message_btn" onClick={edit_Message_btn}> 수정 </button>
                        :
                        <button type="button" className="message_btn" onClick={sendMessages}> 전송 </button>
                        }
                    </div>
                    </>
                    :
                    ''
                    }
                </div>  {/* center e */}
    </>)
}