import React , { useState , useEffect , useRef } from 'react';
import axios from 'axios';

import { Paper , Button , Box , TextField , Typography , Modal } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function AddAddressBook( props ) {


    const [ editData , setEditData ] = useState({});


    // 테이블 구성 요소
    const columns = [
      { field: 'id', headerName: '번호', width: 90 },
      { field: 'addrName', headerName: '이름', width: 100 , editable : true },
      { field: 'addrPhone', headerName: '전화번호', width: 150 , editable : true },
      { field: 'addrEmail', headerName: '이메일', width: 150 , editable : true }
    ];


    const [ rowSelectionModel, setRowSelectionModel ] = React.useState([]);
    const [ addrBookList , setAddressBookList ] = useState([]);

    console.log( rowSelectionModel );
    console.log( props.addrGroupList );

    console.log( props.selectedId + " 그룹으로부터 받은 선택된 그룹아이디" );

    const addressAdd = useRef(null);
    const addressEdit = useRef(null);

    // 주소록 등록하기 메소드 ( axios )
    const addressbookAdd = () => {
        console.log( props.selectedId + "등록 버튼 실행");
        console.log( addressAdd.current );

        if( props.selectedId == undefined || props.selectedId == 0 ) {
            alert("그룹을 선택해주세요, 그룹선택 후 주소록 등록이 가능합니다.")
            return;
        }

        let formData = new FormData( addressAdd.current );
        formData.append('groupNo' , props.selectedId );

        axios.post("/addressbook" , formData ).then( r => {
            console.log( r.data );
            if( r.data == 0 ){
                props.groupGet();
                props.alertSet();
                // 사용자 입력값 초기화
                addressAdd.current.reset();
            }
        })
    }

    useEffect( () => {
        getAddressBook();
    } , [props.addrGroupList])

    const getAddressBook = () => {

        let listArray = [];
        setAddressBookList( listArray );

        props.addrGroupList.forEach( (group) => {
            if( group.groupNo == props.selectedId ){
                group.addressBookDtoList.forEach( (list) => {
                    list.id = list.addrNo ;
                    listArray.push( list );
                    setAddressBookList( [...listArray] );
                })
            }
        })
    }

    useEffect( () => {
        console.log( "addressbook useEffect 실행" )
        getAddressBook();
    } , [ props.selectedId ] )


    // 선택한 주소록 삭제하기 [] 배열을 반복문 돌려 체크박스에 체크된 row 값
    const addrDelete = () => {
        rowSelectionModel.forEach( (row) => {
            axios.delete("/addressbook" , { params: { addrNo : row } } ).then( r => {
                console.log( r.data );
                if( r.data ){
                    props.groupGet();
                    props.alertSet();
                }
            })
        })
    }


    // 수정 모달
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        let editSelect = {}

        if( rowSelectionModel.length > 1 ){
            alert("한개 이상의 내용을 수정할 수 없습니다. 하나만 선택하여주세요")
        }

        console.log( rowSelectionModel , "수정하는 id값" )

        editSelect = addrBookList.filter( (o) => o.addrNo == rowSelectionModel )[0];
        console.log( editSelect );
        setEditData( editSelect );
        setOpen(true);
    }

    const handleClose = () => setOpen(false);


    const addrEdit = () => {
        console.log( editData )
        console.log( addressEdit.current )

        let editFormData = new FormData( addressEdit.current );
        editFormData.append("addrNo" , rowSelectionModel );

        axios.post("/addressbook/update" , editFormData ).then( r => {
            console.log( r.data );
            if( r.data ){
                props.groupGet();
                props.alertSet();
                handleClose();
            }else{
                props.failAlert();
            }
        })

    }

    const infoEdit = () =>{ // form 내부 텍스트 필드가 체인지 됐을 경우

            console.log('테스트입니다.')
            console.log( addressEdit.current );
            console.log( addressEdit.current.addrName );
            console.log( addressEdit.current.addrName.value );
            // useRef 활용 텍스트필드의 value 값을 가져온다

            editData.addrName = addressEdit.current.addrName.value;
            editData.addrPhone = addressEdit.current.addrPhone.value;
            editData.addrEmail = addressEdit.current.addrEmail.value;

            // useState 상태변수에 대입하여 렌더링
            setEditData( {...editData} );

        }


    return (<>
        <Paper elevation={3} style={{ height: "100%" , marginLeft: '9px'}}>
            <h4 className="addr-add-title"> 주소록 목록 </h4>
            <div>
                <Box sx={{ height: 400, width: '95%' , margin: '0px auto'}}>
                    <Button onClick={ handleOpen } color="success"> 수정 </Button>
                    <Button onClick={ addrDelete } color="success"> 선택삭제 </Button>
                    <DataGrid
                        rows={ addrBookList }
                        columns={columns}
                        editMode="row"
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        onRowSelectionModelChange={ (newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                    />
                    <h4 className="add-title"> 주소록 등록 </h4>
                    <div className="add-input-box">
                        <form ref={ addressAdd } className="addressAdd-form" >
                            <TextField sx={{ width: 150 }} label="이름" size="small" type="text" className="addr_name" name="addrName" />
                            <TextField sx={{ width: 200 }} label="전화번호" size="small" type="text" className="addr_phone" name="addrPhone" />
                            <TextField sx={{ width: 250 }} label="이메일" size="small" type="text" className="addr_email" name="addrEmail" />
                            <Button color="success" className="addr-add-btn" onClick={ addressbookAdd }> + </Button>
                        </form>
                    </div>
                </Box>
            </div>
        </Paper>

        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                주소록 수정하기
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <form ref={ addressEdit } className="addressAdd-form" onChange={ infoEdit } >
                    <TextField sx={{ width: 150 }} label="이름" size="small" type="text" className="addr_name" name="addrName" value={ editData.addrName }/>
                    <TextField sx={{ width: 200 }} label="전화번호" size="small" type="text" className="addr_phone" name="addrPhone" value={ editData.addrPhone }/>
                    <TextField sx={{ width: 250 }} label="이메일" size="small" type="text" className="addr_email" name="addrEmail" value={ editData.addrEmail }/>
                </form>
                <Button onClick={ addrEdit } color="success"> 적용 </Button>
                <Button onClick={ handleClose } color="success" > 취소 </Button>
              </Typography>
            </Box>
          </Modal>
        </div>

    </>)
}