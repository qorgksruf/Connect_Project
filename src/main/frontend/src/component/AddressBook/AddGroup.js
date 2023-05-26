import React , { useState , useEffect , useRef } from 'react';
import axios from 'axios';

import PropTypes from 'prop-types';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import { useSpring, animated } from '@react-spring/web';
import {
    Paper , Stack , Alert , Collapse , styled ,
    alpha , SvgIcon , Button , Box , Typography ,
    Modal , TextField , ListSubheader , List ,
    ListItemButton , ListItemIcon , ListItemText ,
    InboxIcon , DraftsIcon , SendIcon ,
    ExpandLess , ExpandMore , StarBorder
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4
};
export default function AddGroup( props ) {

    // 모달 제어 변수 및 메소드
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // 선택된 그룹번호를 담을 변수
    const [ selectedId, setSelectedId ] = useState(null);

    const groupName = useRef(null);

    const updateName = useRef(null);

    const [ updateOpen , setUpdateOpen ] = useState(false);
    const updateHandleOpen = () => setUpdateOpen(true);
    const updateHandleClose = () => setUpdateOpen(false);

    useEffect( () => {
        props.groupGet();
    } , [] )



    const handleClick = (event) => {
        console.log( event.target.id + " 클릭됨");
        console.log( event.target );
        const targetId = event.target.id;

        if ( selectedId == targetId) {
            setSelectedId( 0 );
            props.getId(0);
        } else {
            setSelectedId(targetId);
            props.getId( targetId );
        }
    };


    const groupAdd = () => {
        console.log( "groupAdd 클릭" );
        console.log( groupName.current.value );

        axios.post("/addressgroup" , { groupName : groupName.current.value } ).then( r =>{
            if( r.data == 0 ){
                handleClose();
                props.alertSet();
                props.groupGet();
            }else if( r.data == 1 ){
                props.failAlert();
            }
            // <Alert severity="success"> 성공적으로 주소록이 등록되었습니다! </Alert>
        })
    }


    // 선택된 그룹 삭제하기
    const deleteGroup = () => {

        console.log( selectedId );

        let deleteConfirm = window.confirm( "선택된 그룹이 삭제됩니다, 정말 삭제하시겠습니까?");
        if( deleteConfirm ){
            axios.delete("/addressgroup" , { params : { groupNo : selectedId } } ).then( r => {
                console.log( r.data );
                if( r.data ){
                    props.groupGet();
                }else{
                    props.failAlert();
                }
            })
        }
    }

    const updateGroup = () => {
        console.log( selectedId + "그룹 수정하기 ");
        console.log( groupName );

        axios.put("/addressgroup" , { groupNo : selectedId , groupName : groupName.current.value } ).then( r => {
            console.log( r.data );
            if( r.data ){
                updateHandleClose();
                props.alertSet();
                props.groupGet();
            }else{
                props.failAlert();
            }
        })
    }


    return (<>
        <Paper elevation={3} style={{ height: "100%" }}>
            <div className="group-add-btnbox">
                <Button color="success" variant="contained" size="small" className="group-addBtn" onClick={ handleOpen }> 그룹추가 </Button>
                <Button color="success" variant="outlined" size="small" onClick={ deleteGroup }> 그룹삭제 </Button>
                <Button color="success" className="updateBtn" size="small" onClick={ updateHandleOpen }> <EditIcon color="success" /> </Button>
            </div>
            <div className="group-List-Box">
                {
                    props.addrGroupList.map( (g) => {
                        return (<>
                            <div
                                className={ selectedId == g.groupNo ? "clicked" : "non-clicked"}
                                onClick={ handleClick }
                                id={ g.groupNo }
                            >
                                { g.groupName }
                            </div>
                        </>)
                    })
                }
            </div>
        </Paper>

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    그룹 등록하기
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <TextField inputRef={ groupName } name="groupName" label="그룹명" variant="standard" style={{ margin:"20px 0px" }}/>
                    <div>
                        <Button color="success" variant="contained" size="small" className="group-addBtn" onClick={ groupAdd }> 등록 </Button>
                        <Button color="success" variant="outlined" size="small" onClick={ handleClose }> 취소 </Button>
                    </div>
                </Typography>
            </Box>
        </Modal>

        <Modal
            open={ updateOpen }
            onClose={ updateHandleClose }
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    그룹명 수정하기
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <TextField inputRef={ groupName } name="groupName" label="그룹명" variant="standard" style={{ margin:"20px 0px" }}/>
                    <div>
                        <Button color="success" variant="contained" size="small" className="group-addBtn" onClick={ updateGroup }> 수정 </Button>
                        <Button color="success" variant="outlined" size="small" onClick={ updateHandleClose }> 취소 </Button>
                    </div>
                </Typography>
            </Box>
        </Modal>

    </>)
}