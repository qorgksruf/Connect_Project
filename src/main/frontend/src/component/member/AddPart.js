import React , { useState , useEffect , useRef } from 'react';
import axios from 'axios';

import { Container , TextField , Button , Paper } from '@mui/material';

export default function AddPart( props ) {

    const [ partList , setPartList ] = useState([]);
    const [ selectedId, setSelectedId ] = useState(0);
    const [ selectedPart , setSelectedPart ] = useState({}) ;
    const newPartName = useRef(null);
    const editPartNameField = useRef(null);

    const getPartList = () => {
        axios.get("/part").then( r => {
            console.log( r.data );
            setPartList( r.data );
        })
    }

    useEffect( () => {
        getPartList();
    } , [])

    const handleClick = (event) => {
        console.log( event.target.id + " 클릭됨");
        console.log( event.target );
        const targetId = event.target.id;

        if ( selectedId == targetId) {
            setSelectedId( 0 );
        } else {
            setSelectedId(targetId);
        }
        selectPart( targetId );
    };

    const selectPart = ( targetId ) => {
        partList.forEach( (p) => {
            if( p.partNo == targetId ){
                setSelectedPart( p );
            }
        })
    }

    const editPartName = ( event ) => {
        console.log( event.target.value )
        selectedPart.partName = event.target.value;
        setSelectedPart( {...selectedPart} );
    }

    console.log( partList );

    const deletePart = () => {
        console.log( selectedPart.partNo , '삭제대상입니다.');

        axios.delete("/part" , { params : { partNo : selectedPart.partNo } } ).then( r => {
            console.log( r.data );
            if( r.data ){
                alert("부서 삭제가 완료되었습니다.")
                getPartList();
            }else{
                alert("부서 삭제에 실패하였습니다, 현재 해당부서로 등록된 계정 및 게시글이 존재합니다.")
            }
        })
    }

    const editPart = () => {
        console.log( editPartNameField.current.value );
        axios.put("/part" , { partNo : selectedId , partName : editPartNameField.current.value } ).then( r => {
            console.log( r.data );
            if( r.data ){
                alert("부서 수정이 완료되었습니다.")
                getPartList();
            }else{
                alert("부서 수정에 실패하였습니다.")
            }
        })
    }

    const addPartHandler = () => {
        console.log( newPartName.current );
        console.log( newPartName.current.value );
        axios.post("/part" , { partName : newPartName.current.value } ).then( r => {
            console.log( r.data );
            if( r.data ){
                alert("부서 등록이 완료되었습니다.")
                getPartList();
            }else{
                alert("부서 등록에 실패하였습니다.")
            }
        })
    }


    return (<>
        <Container>
            <h3 class="add-part-title"> 부서관리 </h3>
            <Paper elevation={3} style={{ height:"400px" , width:"100%" }}>
                <div className="part-wrap">
                    <div className="add-part-list-box">
                        <div className="add-part-btn-box">
                            <Button color="success" onClick={ deletePart }> 선택삭제 </Button>
                        </div>
                        <div className="all-part-list">
                            {
                                partList.map( (p) => {
                                    return (<>
                                        <div
                                            className={ selectedId == p.partNo ? "clicked" : "non-clicked"}
                                            onClick={ handleClick }
                                            id={ p.partNo }
                                        >
                                            { p.partName }
                                        </div>
                                    </>)
                                })
                            }
                        </div>
                    </div>
                    <div className="add-part-box">
                        <h5 className="add-part-small-title"> 부서 등록하기 </h5>
                        <div>
                            <TextField
                                inputRef={ newPartName }
                                type="text"
                                size="small"
                                label="부서명"
                            >
                            </TextField>
                            <Button color="success" onClick={ addPartHandler }> 등록 </Button>
                        </div>

                        <div className={ selectedId != 0 ? "edit-part-name-box" : "non-edit" } >
                            <h5 className="add-part-small-title-edit"> 부서명 수정하기 </h5>
                            <TextField
                                inputRef={ editPartNameField }
                                type="text"
                                size="small"
                                label="부서명"
                                id={ selectedPart.partNo }
                                value={ selectedPart.partName }
                                onChange={ (event) => editPartName(event) }
                            >
                            </TextField>
                            <Button color="success" onClick={ editPart }> 수정 </Button>
                        </div>

                    </div>
                </div>
            </Paper>
        </Container>
    </>)
}