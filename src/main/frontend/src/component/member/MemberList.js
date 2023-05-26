import React , { useState , useEffect , useRef } from 'react';
import axios from 'axios';

import styles from '../css/member/memberList.css';

import AddPart from './AddPart';


import {
    Container , TextField , Select , SelectChangeEvent , InputLabel ,
    MenuItem , FormControl , Button , Paper
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MemberList( props ) {

    const[ editInfo , setEditInfo ] = useState({});
    const [ selectMember , setSelectedMember ] = useState('');
    const [ rank , setRank ] = useState( 0 );
    const [ selectValue , setSelectValue ] = useState( 0 );

    const [ part , setPart ] = useState([]);

    const partState = useRef(null);
    console.log( partState.current );

    const [imageSrc, setImageSrc] = useState('');

    // 정보수정 렌더링 상태변수



    // 모달 제어 변수
    const [open, setOpen] = React.useState(false);

    const handleOpen = ( event , params ) => {

        // renderCell 함수는 params 로 값을 받고 해당 값을 살펴보면 row 라는 데이터가 들어있다.
        console.log( event );
        console.log( params );
        console.log( params.row.memberId );
        setSelectedMember( params.row.memberId );
        setRank( params.row.memberRank );
        setSelectValue( params.row.partNo );
        setEditInfo( params.row );
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const getPart = () => {

        axios.get("/part").then( r => {
            console.log( r.data );
            setPart( r.data );
        })

    }

    // 멤버리스트 테이블 제어 변수
    const [ rows , setRows ] = useState([]);
    const [ rowSelectionModel, setRowSelectionModel ] = React.useState([]);
    console.log( rowSelectionModel );

    let updateMember = useRef(null);

    const getMemberList = () => {
        console.log('getMemberList 실행')
        axios.get("/member").then( r => {
            // mui 사용시 반드시 id 값이 필요
            r.data.forEach( ( m ) => {
                m.id = m.memberNo; // axios 로 받은 데이터를 반복문을 돌려 id 필드 추가
            })

            setRows( r.data );
        })
    }

    const onDeleteHandler = () => {

        const msg = window.confirm("삭제 시 복구가 불가능합니다. 삭제하시겠습니까?");

        if( msg ) {
            rowSelectionModel.forEach( o => {
                axios.delete("/member" , { params : { memberNo : o } } ).then( r => {
                    if( r.data ) {
                        getMemberList();
                    }else{
                        alert("[ FAIL ] 삭제 실패")
                    }
                })
            })
        }
    }


    useEffect( () => {
        getMemberList();
        getPart();
    } , [] )

    const handleChange = (event: SelectChangeEvent) => {
        console.log(event.target.value);
        setRank(event.target.value);
    };

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

    const handleChangePart = (event: SelectChangeEvent) => {
        console.log(event.target.value);
        setSelectValue(event.target.value);
    };

    // 수정 텍스트필드 렌더링을 위한 객체 생성 함수
    const infoEdit = () =>{ // form 내부 텍스트 필드가 체인지 됐을 경우

        console.log('테스트입니다.')
        console.log( updateMember.current );
        console.log( updateMember.current.memberName );
        console.log( updateMember.current.memberName.value );
        // useRef 활용 텍스트필드의 value 값을 가져온다

        let newInfo = { // 새로운 객체에 각 텍스트필드 입력값을 체인지 마다 받아와 저장하고
            memberNo : editInfo.memberNo,
            memberName : updateMember.current.memberName.value,
            memberPwd : updateMember.current.memberPwd.value,
            memberPwdConfirm : updateMember.current.memberPwdConfirm.value,
            memberPhone : updateMember.current.memberPhone.value,
            memberEmail : updateMember.current.memberEmail.value
        }

        // useState 상태변수에 대입하여 렌더링
        setEditInfo( newInfo );

    }

    const memberUpdate = () => {
        console.log('업데이트')

        console.log( updateMember.current );
        console.log( updateMember.current.memberName.value );

        if( updateMember.current.memberRank.value == 0 ){
            alert("직급를 선택해주세요");
        }
        if( updateMember.current.pratNo.value == 0 ){
            alert("부서를 선택해주세요");
        }

        let updateFormData = new FormData( updateMember.current );
        updateFormData.append( 'memberNo' , editInfo.memberNo );

        axios.post("/member/update" , updateFormData ).then( r => {
            console.log( r );
            if( r.data == 0 ){
                alert("수정이 완료되었습니다.");
                handleClose();
                getMemberList();
            }else if( r.data == 1 ){
                alert("입력하신 비밀번호와 비밀번호확인이 일치하지 않습니다.")
            }else{
                alert("등록실패, 관리자에게 문의해주세요.")
            }
        })
    }



    const columns = [
            { field: 'id', headerName: '번호', width: 100 },
            { field: 'memberId', headerName: '아이디', width: 100 },
            { field: 'partName', headerName: '부서', width: 100 },
            { field: 'memberRank',
                headerName: '직급',
                width: 150,
                valueFormatter: (params) => {
                    const value = params.value;
                    if( value == 1 ){
                        return '사원';
                    }else if(value == 2) {
                        return '주임';
                    }else if(value == 3) {
                        return '대리';
                    }else if(value == 4 ){
                        return '과장';
                    }else if(value == 5 ){
                        return '차장';
                    }else if(value == 6) {
                        return '팀장';
                    }else if(value == 7){
                        return '부장';
                    }else if( value == 9 ){
                        return '사장';
                    }else{
                        return '슈퍼관리자'
                    }
                }
            },
            { field: 'memberName', headerName: '사원명', width: 100 },
            { field: 'memberPhone', headerName: '휴대폰', width: 200 },
            { field: 'memberEmail', headerName: '이메일', width: 200 },
            { field:
                'data' ,
                headerName : '수정' ,
                width: 100 ,
                // 수정버튼 [ 모달 ]
                renderCell : (params) => (
                    <Container>
                        <div>
                          <Button onClick={ (event) => handleOpen( event , params ) }> 수정 </Button>
                          <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                              <Typography id="modal-modal-title" variant="h6" component="h2">
                                회원 정보 수정
                              </Typography>
                              <div>
                                <form ref={ updateMember } onChange={ infoEdit } className="updateForm">
                                    <div className="memberList-itemBox">
                                        <FormControl className="List_rank">
                                            <InputLabel> 부서선택 </InputLabel>
                                            <Select
                                              value={ selectValue }
                                              label="부서"
                                              onChange={ handleChangePart }
                                              name="partNo"
                                            >
                                                <MenuItem value={0}> 부서를 선택해주세요. </MenuItem>
                                                {
                                                    part.map( (p) => {
                                                        return (
                                                            <MenuItem value={ p.partNo }> { p.partName } </MenuItem>
                                                        );
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                        <FormControl className="input_rank">
                                            <InputLabel> 직급 </InputLabel>
                                            <Select
                                              value={ rank }
                                              label="직급"
                                              onChange={ handleChange }
                                              name="memberRank"
                                            >
                                              <MenuItem value={0}> 직급을 선택해주세요 </MenuItem>
                                              <MenuItem value={1}> 사원 </MenuItem>
                                              <MenuItem value={2}> 주임 </MenuItem>
                                              <MenuItem value={3}> 대리 </MenuItem>
                                              <MenuItem value={4}> 과장 </MenuItem>
                                              <MenuItem value={5}> 차장 </MenuItem>
                                              <MenuItem value={6}> 팀장 </MenuItem>
                                              <MenuItem value={7}> 부장 </MenuItem>
                                              <MenuItem value={9}> 대표이사 </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <TextField
                                        id="memberId"
                                        label="아이디"
                                        defaultValue={ selectMember }
                                        variant="standard"
                                        disabled
                                    />
                                    <TextField name="memberName" type="text" value={ editInfo.memberName } label="이름" variant="standard" />
                                    <TextField name="memberPwd" type="password" value={ editInfo.memberPwd } label="비밀번호" variant="standard" />
                                    <TextField name="memberPwdConfirm" type="password" value={ editInfo.memberPwdConfirm } label="비밀번호 확인" variant="standard" />
                                    <TextField name="memberPhone" type="text" value={ editInfo.memberPhone } label="연락처" variant="standard" />
                                    <TextField name="memberEmail" type="text" value={ editInfo.memberEmail } label="이메일" variant="standard" />
                                    <div className="List-profileBox">
                                        <TextField type="file" className="inputProfile" name="memberProfile" onChange={ handleImageUpload } />
                                        <div className="preview">
                                            { imageSrc && <img src={imageSrc} alt="preview-img" /> }
                                        </div>
                                    </div>
                                </form>
                              </div>
                              <div className="modiBtnBox">
                                <Button onClick={ memberUpdate }> 수정 </Button>
                                <Button onClick={ handleClose }> 취소 </Button>
                              </div>
                            </Box>
                          </Modal>
                        </div>
                    </Container>
                )
            }
        ];

    return(<>
        <Container>

            <h3 className="member-manage"> 직원관리 </h3>

              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={ onDeleteHandler }
                className="member-delete-btn"
              >
                선택삭제
              </Button>

            <div style={{ height: '100%', width: '100%' }}>
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
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={ (newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                />
            </div>
        </Container>
    </>);

}