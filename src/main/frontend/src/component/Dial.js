import react , { useState , useEffect , useRef } from 'react';

import { Link } from 'react-router-dom';

import SideBar from './SideBar';
import { Paper , Button } from "@mui/material"

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import ChatIcon from '@mui/icons-material/ChatBubble';
import DescriptionIcon from '@mui/icons-material/Description';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

export default function Dial( props ) {

    return (<>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 50, right: 50 }}
        icon={<SpeedDialIcon />}
        FabProps={{
            style: { backgroundColor: '#548235' }
        }}
      >
        <SpeedDialAction
            icon={ <ChatIcon /> }
            tooltipTitle="메신저"
            component={ Link }
            to="/messenger"
        />
        <SpeedDialAction
            icon={ <ContentPasteIcon /> }
            tooltipTitle="게시판"
            component={ Link }
            to="/list"
        />
        <SpeedDialAction
            icon={ <AccountBoxIcon /> }
            tooltipTitle="주소록"
            component={ Link }
            to="/member/addressbook"
        />
        <SpeedDialAction
            icon={ <DescriptionIcon /> }
            tooltipTitle="서류결재"
            component={ Link }
            to="/approval"
        />
      </SpeedDial>
    </>)
}