import React , { useState , useEffect , useRef } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonCirclePlus } from "@fortawesome/free-Solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-Solid-svg-icons";
import { faPersonCircleXmark } from "@fortawesome/free-Solid-svg-icons";

export default function Invite(props){

/*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 전역 변수 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/
    //1.초대할 인원
    const [ inviteMember , setInviteMember] = useState([]);

    //1-2. 초대할 인원 데이터 가공
    const [rows, setRows] = useState([]);

    //1-3. 선택한 인원
    const [rowSelectionModel ,setRowSelectionModel] = React.useState([]);

    //2.초대된 인원
    const [inMember , setInMember] = useState([]);

    // 멤버 이미지
    const [ imageUrl , setImageUrl ] = useState("");
/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 함수 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/

/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 초대하기 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/
    //1. 현재 DB에 초대안된 멤버 불러오기
    const invite = () => {
        //가져오기
        document.querySelector('.modal_wrap3').style.display = 'block';
        axios.get("/chat/invite", {params:{chatRoomId:props.roomId}})
             .then(r=>{ setInviteMember(r.data);

             //현재 체크된 멤버 초기화
             const allCheck = document.querySelector('.Mui-checked');
             allCheck.querySelector('.PrivateSwitchBase-input ').click();

             const check = document.querySelector('.MuiCheckbox-indeterminate');
             check.querySelector('.PrivateSwitchBase-input ').click();
             })
    }

    //2. 멤버를 불러오면 데이터 가공 함수 실행하기
    useEffect( () =>{setIng(); } , [inviteMember] )

    //3. 테이블 필드 만들기
    //3-1. 필드 설정
    const columns = [
      { field: 'id', headerName: 'No', width: 70 },
      { field: 'memberName', headerName: '이름', width: 70 },
      { field: 'memberEmail', headerName: '이메일', width: 130 },
      { field: 'memberPhone', headerName: '연락처', width: 130 },
      { field: 'partName',headerName: '부서',width: 90}];

    //3-2. 테이블 레코드 만들기
    const setIng = () => {
        //테이블 초기화
        setRows([]);
        inviteMember.map((o)=>{
        //DB에 member 데이터를 가공하는 과정
        let row =  { id:o.memberNo , memberName: o.memberName, memberEmail: o.memberEmail,
        memberPhone: o.memberPhone, partName: o.partName };
        setRows(rows => [...rows, row])
    })}

    //4. 클릭한 회원 초대하기
    const memberInvite = () => {
         let msg = window.confirm("초대하시겠습니까?")
        if(msg==true){
        rowSelectionModel.forEach(r => {
            let chatParticipantsDto= {memberNo:r, chatRoomId:props.roomId }
            axios.post("/chat/invite", chatParticipantsDto )
                .then(r=>{ closeModal(); //모달 닫기
                in_Member();
                })
        })
        alert('초대가 완료되었습니다!');
        }
    }
    //5) 모달 나가기
    const closeModal = () => {document.querySelector('.modal_wrap3').style.display = 'none'}

    /* --------------------------------- 채팅방 회원 이미지 출력 ---------------------------------------------------*/
    //1. 현재 DB에 초대된 멤버 불러오기
    const in_Member = () => {
        axios.get("/chat/inMember", {params:{chatRoomId:props.roomId}})
             .then(r=>{ setInMember(r.data);  })
    }

    //2. 채팅방 클릭시 작동
    useEffect ( () => {in_Member()} , [props.roomId]);

    //3. 멤버불러올시(in_Member) 작동
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
        });
    }

    //채팅방 나가기
    const chat_leave = () => {
       axios.delete("/chat/leave", {params:{chatRoomId:props.roomId}})
            .then((r)=>{
                if(r.data==true){
                    alert('채팅방을 나가셨습니다!');
                    window.location.reload(); //새로고침
                }
            else{alert('오류!')}}
            )
    }


    //강퇴
    const kick = (memberNo) => {
        console.log(props.roomId + " "+ memberNo)
        axios.delete("/chat/kick",{params:{chatRoomId:props.roomId , memberNo:memberNo}})
            .then((r)=>{
                if(r.data == true){
                alert('강퇴하셨습니다!');in_Member();
                }
            })

    }



    return(<>
              <div className="header flex_end">
                   { props.roomId == 0 ? '':
                       <div className="invite" onClick={invite}>
                       <FontAwesomeIcon icon={faPersonCirclePlus} size="2x" />
                       </div>
                   }
              </div>

              <div className="right_content">
                    { inMember.map((o)=>(
                        <div className="one_member">
                            <div className="member_img">
                                 <img src={""+o.uuidFilename}/>
                            </div>
                            <div className="member_name">{o.memberName}</div>
                            { props.nowRoom.memberNo != props.member.memberNo ? '' :
                            <div className="member_No" onClick={(e)=>kick(o.memberNo)}  >
                            <FontAwesomeIcon icon={faPersonCircleXmark} size="2x"/>
                            </div>
                            }
                        </div>
                      ))
                    }
              </div>

              <div className="right_bottom">
                 { props.roomId == 0 ? '':
                     <div className="leave_icon">
                        <FontAwesomeIcon icon={faRightFromBracket} size="2x" onClick={chat_leave}/>
                     </div>
                  }
              </div>

              {/* 채팅방 초대 모달 창*/}
              <div className="modal_wrap3"  >
                  <div className="modal_box modal_box3">

                      <h3 className="modal_title">초대하기</h3>
                            <div style={{ height: 400, width: '100%' }}>
                              <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                  pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                  },
                                }}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection
                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                setRowSelectionModel(newRowSelectionModel);
                                }}
                              />
                            </div>

                      <div className="modal_btns">
                          <button onClick={memberInvite} className="modal_check" type="button">초대하기</button>
                          <button onClick={closeModal} className="modal_cencel" type="button">닫기</button>
                      </div>
                  </div>
              </div> {/* modal_wrap3  e*/}
    </>)
}