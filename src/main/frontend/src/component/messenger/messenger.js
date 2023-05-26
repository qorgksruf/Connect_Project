import React , { useState , useEffect , useRef } from 'react';
import axios from 'axios';
import '../css/messenger/messenger.css';
import ChatRoom from './ChatRoom';
import Invite from './Invite'
/* ------------------------ mui ------------------------------*/
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

/* ------------------------폰트 어썸--------------------------
npm i --save @fortawesome/fontawesome-svg-core
npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/react-fontawesome
npm i @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons
npm i @fortawesome/react-fontawesome
*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
//     {사용할 아이콘(카라멜)} from "@fortawesome/free-(regular, solid)-svg-icons";
import { faComments } from "@fortawesome/free-regular-svg-icons";


export default function Messenger(props){
    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ로그인ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    //로그인 정보 객체
    let member = JSON.parse( sessionStorage.getItem("login_token") );

    //로그인 정보 가져오는 함수
    useEffect(()=>{
        axios.get("/login")
            .then(r=>{
            if(r.data.memberNo==0){
                alert('오류!');  window.location.href ="/";
            }else{member = r.data}
            })
    },[])
    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 로그인 끝 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 채팅방 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    // 0.방 만들기 모달 용
    const [modal, setModal] = useState(false);

    // 1-1.채팅방만들시 사용할 제목
    const [title, setTitle] = useState("");
    // 1-2. 채팅방 이미지
    let chat_fileForm = useRef(null); // Form
    // 1-3. input file 작동용
    let chat_fileInputClick= useRef(null); // input file
    // 1-4. 채팅방 이미지 미리보기
    const [imageSrc, setImageSrc] = useState('');

    // 2-1.채팅방 배열
    const [chatRooms , SetChatRooms] = useState([]);

    //2-2. 클릭한 채팅방 번호
    const [roomId , setRoomId] = useState(0);

    //2-3. 클릭한 채팅방 배열
    const [nowRoom, setNowRoom] = useState();

    //3. 수정+삭제할 채팅방 번호
    const [editId, setEditId] = useState(0);

    //4. 수정시 채팅방 파일
    // 4-1. 채팅방 이미지
    let chat_fileForm2 = useRef(null); // Form
    // 4-2. input file 작동용
    let chat_fileInputClick2 = useRef(null); // input file
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 함수 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    // 1-1. 채팅방 만들기
        //1) 방만드는 아이콘 클릭시 모달나오게하기
    const create_chat = () => { setModal(true);}
        //2) TextField 값 가져오기
    const titleChange = (event) => { setTitle(event.target.value); }

        //3. 버튼클릭시 input태그에 클릭이벤트를 걸어준다.
    const fileUpload = () => {chat_fileInputClick.current.click();};

        //4) 전달하기
    const create = () => {
        let ChatRoomsDto = {name:title , memberNo: member.memberNo}
         if(title == ""){
            alert("채팅방 제목을 설정하셔야합니다!"); return;
         }
         else if(chat_fileInputClick.current.value != ''){ //첨부파일 존재시
            let formData = new FormData( chat_fileForm.current )
            formData.set('name',title); formData.set('memberNo', member.memberNo );
            axios.post("/chat/file", formData)
                 .then(r => {
                    if(r.data == true) {
                    alert("방 생성 완료!");setModal(false);
                    document.querySelector('#title_input').value ="";
                    printChat(); chat_fileInputClick.current.value='';
                    }else{alert("오류가 발생하였습니다.");}
                 })
         }
         else{axios.post("/chat" , ChatRoomsDto ) //첨부파일 존재하지 않을시
                    .then(r => {
                        if(r.data == true) {
                        alert("방 생성 완료!");setModal(false);
                        document.querySelector('#title_input').value ="";
                        printChat();
                        }else{alert("오류가 발생하였습니다.");}
                    })
        }
    }

    //3) 모달 나가기
    const closeModal = () => {setModal(false); document.querySelector('.modal_wrap2').style.display = 'none';
                                               document.querySelector('.modal_wrap3').style.display = 'none'}

    //2. 채팅방 출력하기
    const printChat = () => {
          axios.get("/chat")
                .then(r=> { SetChatRooms([...r.data]);})
    }

    // 2-2. 채팅방 출력하기 (처음 한번)
    useEffect(()=>{ printChat();},[])

    //2-3. 채팅방 클릭시 채팅방번호 수정후 ChatRoom에게 전달
    const clickRooms = (chatRoomId)=> { setRoomId(chatRoomId);  }

	//3. 채팅방 우클릭시 수정,삭제창 보이게
     const show_menu=(e,chatRoomId)=>{
        e.preventDefault(); //기존 우클릭 이벤트 제거
        //현재 우클릭한 채팅방을 제외한 나머지 모두 none
        document.querySelectorAll('.chat_menu').forEach((o)=>{  o.style.display='none'; })
        let x = e.pageX + 'px'; /* 현재 마우스의 X좌표 */ let y = e.pageY + 'px'; // 현재 마우스의 Y좌표
        const chat_menu = document.querySelector('.num_'+chatRoomId);
        chat_menu.style.left = x; chat_menu.style.top = y; chat_menu.style.display = 'block';
        setEditId(chatRoomId); //어떤 채팅방을 클릭했는지 알려주기
     }

    //3-1. 아무곳이나 클릭시 우클릭 메뉴 숨기기
     const hide_menu = ((e) => {
         document.querySelectorAll('.chat_menu').forEach((o)=>{  o.style.display='none'; })
     });

     //3-2. 수정 클릭시 수정팝업창
     const edit_chat = ((chatRoomId)=>{
          document.querySelector('.modal_wrap2').style.display = 'block';
     })

     //3-3. 채팅방 이름 수정하기
     const editChat = (()=>{
        //유효성 검사
        if(editId == ""){alert('수정할 채팅방 이름을 입력해주세요'); return;}
        //첨부파일 있다면
        else if (chat_fileInputClick2.current.value != ''){
            let formData = new FormData( chat_fileForm2.current )
            formData.set('chatRoomId',editId); formData.set('name', title );
            axios.put("/chat/update", formData)
                 .then(r=> { if(r.data==true){ alert('방 이름이 변경되었습니다.'); printChat(); closeModal();}
                            else{alert('오류!')}  })
        }else{ // 첨부파일이 없다면
        let chatRoomsDto = {"chatRoomId":editId , "name":title  }
        axios.put("/chat", chatRoomsDto )           //send chat room        //변경시 모달창닫기, 채팅창 업뎃
             .then(r=> { if(r.data==true){ alert('방 이름이 변경되었습니다.'); printChat(); closeModal();}
                        else{alert('오류!')}  } )
        }
     })

     //3-4. 버튼클릭시 input태그에 클릭이벤트를 걸어준다.
     const fileUpload2 = () => {chat_fileInputClick2.current.click();};

     //4. 채팅방 삭제
     const del_chat = ((chatRoomId)=>{
        axios.delete("/chat", {params:{"chatRoomId":chatRoomId }})
            .then(r=>{  if(r.data==true){alert('삭제 되었습니다.'); printChat();}
                        else{alert('오류!') } } )
     })

    //채팅방 이미지 미리보기
    const encodeFileToBase64 = (fileBlob) => {

        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);

        return new Promise( (resolve) => {
            reader.onload = () => {
                setImageSrc(reader.result);
                resolve();
            };
        });
    };

    const handleImageUpload = (e) => {
        console.log("이미지업로드");
        encodeFileToBase64(e.target.files[0]);
    }

    //클릭한 채팅방
    const now_chat = () => {
        chatRooms.forEach((o)=>{
            if(o.chatRoomId == roomId){
                setNowRoom(o);
            }
        })
    }

    useEffect (()=>{now_chat()},[roomId])

    return(<>
    <div className="container" onClick={hide_menu}>
        <div className="wrap">
        {/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ left ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ */}
            <div className="left">
                {/* 왼쪽 상단 부분 = 헤더 */}
                <div className="header">
                    <div className="order_chat"></div>
                    <div className="create_chat" onClick={create_chat}>
                        <FontAwesomeIcon icon={faComments} size="2x" />
                    </div> {/*방만들기 아이콘*/}
                </div>  {/* header e */}

                {/*왼쪽 중단 부분 = 채팅방 */}
                <div className="left_content">

                    {chatRooms.map((o)=>(
                        <div className="chat_room" onClick={(e) => clickRooms(o.chatRoomId)}
                                                   onContextMenu={(e)=>show_menu(e,o.chatRoomId) }> {/* 우클릭 이벤트*/}

                            <div className="chat_room_left">
                                <div className="left_content_img">
                                    {o.uuidFile == null || o.uuidFile == undefined ?
                                    <img className="chat_img" src={"http://192.168.17.34:80/static/media/default.png"}/> :
                                    <img className="chat_img" src={"http://192.168.17.34:80/static/media/" +o.uuidFile}/>
                                    }
                                </div>

                                <div className="msg">
                                    <div className="chat_name">  {o.name} </div>
                                    <div className="msg_text"> 최근 메세지 </div>
                                </div>
                            </div>

                            <div className="chat_room_right">
                                <div className="msg_date"> {o.cdate} </div>
                            </div>
                            {/* 우클릭시 채팅방 수정 삭제 리스트 */}
                            <ul className={"chat_menu num_"+o.chatRoomId}>
                              <li> {o.name} </li>
                              <li onClick={(e)=> edit_chat(o.chatRoomId)}> 채팅방 수정  </li>
                              <li onClick={(e)=> del_chat(o.chatRoomId)}> 채팅방 삭제 </li>
                            </ul>

                        </div>
                    ))}
                </div>  {/* left_content e */}
            </div> {/* left e */}
            {/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 중앙 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/}

            {/* 클릭한 채팅방 Id, 멤버 정보, 현재 채팅객체  */}
            <ChatRoom roomId={roomId} member={member} nowRoom={nowRoom}    />

            {/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 오른쪽 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/}
            <div className="right">
            <Invite roomId={roomId} nowRoom={nowRoom} member={member} />
            </div> {/* right e */}

            {/* 채팅방 생성 모달 창*/}
            <div className="modal_wrap" style={modal ? {display:'block'} : {display:'none'}} >
                <div className="modal_box">
                    <h3 className="modal_title">
                        방만들기
                    </h3>
                    <div className="modal_content">
                         <TextField onChange={titleChange} id="title_input" label="채팅방 제목" variant="standard"  />
                    </div>

                    <h3 className="modal_title">
                        채팅방 이미지
                    </h3>

                    <div className="file">
                      <div className="btn-upload" onClick={fileUpload}>파일 </div>
                    </div>

                    <form ref={chat_fileForm}>
                        <input  ref={chat_fileInputClick} type="file" name="files" id="file" onChange={ handleImageUpload } />
                    </form>

                    <div className="preview">
                        { imageSrc && <img src={imageSrc} alt="preview-img" /> }
                    </div>

                    <div className="modal_btns">
                        <button  onClick={create}  className="modal_check" type="button">방 생성하기</button>
                        <button  onClick={closeModal} className="modal_cencel" type="button">닫기</button>
                    </div>
                </div>
            </div> {/* modal_wrap  e*/}


            {/* 채팅방 수정 모달 창*/}
            <div className="modal_wrap2"  >
                <div className="modal_box">
                    <h3 className="modal_title">
                        방 이름 바꾸기
                    </h3>
                    <div className="modal_content">
                         <TextField onChange={titleChange} id="title_input" label="채팅방 제목" variant="standard"  />
                    </div>

                    <div className="file">
                      <div className="btn-upload" onClick={fileUpload2}>파일 </div>
                    </div>

                    <form ref={chat_fileForm2}>
                        <input  ref={chat_fileInputClick2} type="file" name="files" id="file" onChange={ handleImageUpload } />
                    </form>

                    <div className="preview">
                        { imageSrc && <img src={imageSrc} alt="preview-img" /> }
                    </div>


                    <div className="modal_btns">
                        <button onClick={editChat}  className="modal_check" type="button">방 수정하기</button>
                        <button onClick={closeModal} className="modal_cencel" type="button">닫기</button>
                    </div>
                </div>
            </div> {/* modal_wrap2  e*/}
        </div>  {/*wrap e */}
	</div>  {/* container e */}
    </>)
}