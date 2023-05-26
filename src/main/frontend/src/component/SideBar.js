import React , { useState , useEffect , useRef } from 'react';
import axios from 'axios';

import styles from './css/main/Sidebar.css';

import { Drawer , Box , Typography , Button , IconButton } from "@mui/material"
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';


export default function SideBar( props ) {

    const [ login , setLogin ] = useState( props.login );

    // 사이드바 open , close 상태관리 변수
    const [ isDrawerOpen , setIsDrawerOpen ] = useState( false );

    // 트리 메뉴 확장 변수
    const [expanded, setExpanded] = React.useState([]);

    // 트리 메뉴 확장 토글러
    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleExpandClick = () => {
        setExpanded((oldExpanded) =>
            oldExpanded.length === 0 ? ['1', '6', '10', '12'] : [],
        );
    };



    const handleClick = ( event , nodeIds ) => {

        switch( nodeIds ) {
            case '2' : window.location.href = "/member/memberlist" ;
            break ;
            case '3' : window.location.href = "/member/addpart" ;
            break ;
            case '4' : window.location.href = "/member/addmember" ;
            break ;
            case '5' : window.location.href = "/member/addressbook" ;
            break ;
            case '7' : window.location.href = "/approval" ;
            break ;
            case '8' : window.location.href = "/approval/myapproval" ;
            break ;
            case '9' : window.location.href = "/reportconfirm" ;
            break ;
            case '11' : window.location.href = "/messenger" ;
            break ;
            case '13' : window.location.href = "/list" ;
            break ;
        }

    }

    return( <>
        <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='logo'
            onClick={ () => setIsDrawerOpen( true ) }
        >
            <MenuIcon />
        </IconButton>
        <Drawer
            anchor="left"
            open={ isDrawerOpen }
            onClose={ () => setIsDrawerOpen( false ) }
        >
            <Box p={2} width='400px' textAlign='center' role='presentation'>

                <Typography variant='h6' component='div'>
                    Connect, @
                </Typography>

                <div className="imgBox">
                    <img className="profileImg" src={ props.imageUrl } />
                    <div className="profile_info">
                        <div className="part_name"> { props.login.partName } </div>
                        <div className="member_name"> { props.login.memberName } </div>
                    </div>
                </div>

                <Box sx={{ height: '100%', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}>
                    <Box sx={{ mb: 1 }}>
                        <Button onClick={handleExpandClick} className="allbtn" style={{ margin: "10px" }}>
                            {expanded.length === 0 ? '전체보기' : '간략히 보기'}
                        </Button>
                    </Box>
                    <TreeView
                        aria-label="controlled"
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        expanded={expanded}
                        onNodeToggle={handleToggle}
                        multiSelect
                    >
                        <TreeItem
                            nodeId="1"
                            label={
                                <Typography variant="body1" fontWeight="bold">
                                    직원관리
                                </Typography>
                            }
                        >
                            <TreeItem
                                sx={{ margin: '0px' , paddingRight: '20px' }}
                                nodeId="2"
                                onClick={ (event) => handleClick( event , "2") }
                                label={
                                    <Typography variant="body2">
                                        직원정보
                                    </Typography>
                                }
                            />
                            <TreeItem
                                sx={{ margin: '0px' , paddingRight: '20px' }}
                                nodeId="3"
                                onClick={ (event) => handleClick( event , "3") }
                                label={
                                    <Typography variant="body2">
                                        부서관리
                                    </Typography>
                                }
                            />
                            <TreeItem
                                sx={{ margin: '0px' , paddingRight: '20px' }}
                                nodeId="4"
                                onClick={ (event) => handleClick( event , "4") }
                                label={
                                    <Typography variant="body2">
                                      직원등록
                                    </Typography>
                                }
                            />
                            <TreeItem
                                sx={{ margin: '0px' , paddingRight: '20px' }}
                                nodeId="5"
                                onClick={ (event) => handleClick( event , "5") }
                                label={
                                    <Typography variant="body2">
                                      주소록
                                    </Typography>
                                }
                            />
                        </TreeItem>
                        <TreeItem
                            nodeId="6"
                            label={
                                <Typography variant="body1" fontWeight="bold">
                                    전자결재
                                </Typography>
                            }
                        >
                            <TreeItem
                                sx={{ margin: '0px' , paddingRight: '20px' }}
                                nodeId="7"
                                onClick={ (event) => handleClick( event , "7") }
                                label={
                                    <Typography variant="body2">
                                      결재서류작성
                                    </Typography>
                                }
                            />
                            <TreeItem
                                sx={{ margin: '0px' , paddingRight: '20px' }}
                                nodeId="8"
                                onClick={ (event) => handleClick( event , "8") }
                                label={
                                    <Typography variant="body2">
                                      내 서류상태확인
                                    </Typography>
                                }
                            />
                            <TreeItem
                                sx={{ margin: '0px' , paddingRight: '20px' }}
                                nodeId="9"
                                onClick={ (event) => handleClick( event , "9") }
                                label={
                                    <Typography variant="body2">
                                      결재대기서류확인
                                    </Typography>
                                }
                            />
                        </TreeItem>
                        <TreeItem
                            nodeId="10"
                            label={
                                <Typography variant="body1" fontWeight="bold">
                                    커뮤니티
                                </Typography>
                            }
                        >
                            <TreeItem
                                sx={{ margin: '0px' , paddingRight: '20px' }}
                                nodeId="11"
                                onClick={ (event) => handleClick( event , "11") }
                                label={
                                    <Typography variant="body2">
                                      메신저
                                    </Typography>
                                }
                            />
                        </TreeItem>
                        <TreeItem
                            nodeId="12"
                            label={
                                <Typography variant="body1" fontWeight="bold">
                                    게시판
                                </Typography>
                            }
                        >
                            <TreeItem
                                sx={{ margin: '0px' , paddingRight: '20px' }}
                                nodeId="13"
                                onClick={ (event) => handleClick( event , "13") }
                                label={
                                    <Typography variant="body2">
                                      부서게시판
                                    </Typography>
                                }
                            />
                        </TreeItem>
                    </TreeView>
                </Box>
            </Box>
        </Drawer>
    </>)

}