import react , { useState , useEffect , useRef } from 'react';
import axios from 'axios';
import styles from '../css/member/AddMember.css'

// MUI ----------------------------
import {
    Container , TextField , Select , SelectChangeEvent , InputLabel ,
    MenuItem , FormControl , Button
} from '@mui/material';


export default function AddMember( props ) {


    const [ rank , setRank ] = useState('');
    const [ selectValue , setSelectValue ] = useState(0);

    const [ part , setPart ] = useState([]);

    const partState = useRef(null);
    console.log( partState.current );

    const [imageSrc, setImageSrc] = useState('');

    let memberInfo = useRef(null);
    let memberIdRef = useRef(null);


    const getPart = () => {

        axios.get("/part").then( r => {
            console.log( r.data );
            setPart( r.data );
        })

    }


    useEffect( () => {
        getPart();
    } , [] )


    const addMember = () => {

        console.log('addMember');
        console.log( memberInfo.current );
        console.log( memberInfo.current.memberId.value );

        let formData = new FormData( memberInfo.current );

        axios.post("/member/add", formData ).then( (r) => {
            console.log( r );
            if( r.data ){
                alert("등록 성공");
                window.location.href="/member/memberlist" ;
            }
        })

    }


    const handleChange = (event: SelectChangeEvent) => {
        console.log(event.target.value);
        setRank(event.target.value);
    };

    const handleChangePart = (event: SelectChangeEvent) => {
        console.log(event.target.value);
        setSelectValue(event.target.value);
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

    // ********************************************** 유효성검사
    // 멤버 아이디 중복검사

    let checkArray = [ false , false , false , false , false , false , false ]


    const memberIdChangeHandler = () => {
        console.log( memberIdRef.current.value );

    }

    return (<>
        <Container className="addMember-wrap">
            <form ref={ memberInfo }>
                <div className="addMember-mainBox">
                    <div className="addMember-itemBox">
                        <FormControl className="input_rank">
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
                    </div>
                    <div className="addMember-itemBox">
                        <TextField label="사원명" type="text" className="input_name" name="memberName"/>
                        <FormControl className="input_rank">
                            <InputLabel> 직급 </InputLabel>
                            <Select
                              value={ rank }
                              label="직급"
                              onChange={ handleChange }
                              name="memberRank"
                            >
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
                    <div className="addMember-itemBox">
                        <TextField label="아이디" type="text" className="input_id" name="memberId" inputRef={ memberIdRef } onchange={ memberIdChangeHandler }/>
                        <TextField label="패스워드" type="password" className="input_pwd" name="memberPwd" />
                    </div>
                    <div className="addMember-itemBox">
                        <TextField label="연락처" type="text" className="input_phone" name="memberPhone" />
                    </div>
                    <div className="addMember-itemBox">
                        <TextField label="이메일" type="text" className="input_email" name="memberEmail" />
                    </div>
                    <div className="addMember-itemBox imgBox">
                        <div className="input_btn_box">
                            <TextField type="file" className="input_profile" name="memberProfile" onChange={ handleImageUpload } />
                            <div className="btnBox">
                                <Button variant="contained" onClick={ addMember }> 등록 </Button>
                                <Button variant="outlined"> 취소 </Button>
                            </div>
                        </div>
                        <div className="preview">
                            { imageSrc && <img src={imageSrc} alt="preview-img" /> }
                        </div>
                    </div>
                </div>
            </form>
        </Container>
    </>);
}