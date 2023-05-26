import React , { useEffect } from 'react';
import { BrowserRouter , Routes , Route , Outlet , useLocation } from 'react-router-dom';


import Main from './Main';
import Header from './Header';

//---- templates
import '../templates/css/style.css';
import '../templates/charts/ChartjsConfig';
import Dashboard from '../templates/pages/Dashboard'


// ---------------------- 김동혁 ---------------------------------//
import List from './board/List';
import Write from './board/Write';
import View from './board/View';
import PartBoard from './board/PartBoard';
import BoardUpdate from './board/BoardUpdate';

// -------------- 김성봉 --------------- //
import Home from './Home'
import Login from './member/Login'
import AddMember from './member/AddMember';
import AddPart from './member/AddPart'
import MemberList from './member/MemberList';
import AddrMain from './AddressBook/AddrMain'


import Apaper from './Approval/Apaper';

//----------------------- 이경석 ---------------------------------//
import Messenger from './messenger/messenger';

//-----------------------백한결----------------------------------//
import Approval from './Approval/Approval'; //휴가계작성  [2023-05-04]
import Reportconfirm from './Approval/Reportconfirm'; //레포트상태확인  [2023-05-09]
import ViewA from "./Approval/ViewA" //결제 전 서류 내용 확인  [2023-05-12]
import ViewB from "./Approval/ViewB" //결제 전 서류 내용 확인  [2023-05-12]
import Myapproval from "./Approval/Myapproval" //결제 전 서류 내용 확인 [2023-05-15]
//-----------------------백한결 [2023-05-04]----------------------------------//

/*
    react-router-dom 다양한 라우터 컴포넌트 제공
    1. <BrowserRouter>  : 가상 URL 관리 [ 브라우저 URL 동기화 ]
    2. <Routes>         : 가장 적합한 <Route> 컴포넌트를 검토하고 찾는다.
            요청된 path 에 적합한 <Route> 찾아서 <Routes> 범위내 렌더링
    3. <Route>          : 실제 URL 경로를 지정해주는 컴포넌트
        <Route path="login" element={ <Login /> } />
        http://localhost:3000/login     get 요청시 Login 컴포넌트 반환
*/

export default function Index(props) {
    return (
        <BrowserRouter>
          <App />
        </BrowserRouter>
    );
}

function App() {

    const location = useLocation();

    useEffect(() => {
        document.querySelector('html').style.scrollBehavior = 'auto'
        window.scroll({ top: 0 })
        document.querySelector('html').style.scrollBehavior = ''
    }, [location.pathname]); // use location from hook

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            {/* 로그인페이지를 제외하고 나머지페이지에서는 헤더 컴포넌트 렌더링 하기위해 한번감싸기 */}
            {/* 필요한 페이지 있으신 경우 <Route element={<Main />}> </Route> 안에 라우트 경로만들어서 사용바랍니다. */}
            {/* 2023-05-07 김성봉 */}
            <Route element={<Main />}>
                {/* 김성봉 */}
                <Route path="/home" element={<Home />} />
                <Route path="/member/addmember" element={<AddMember />} />
                <Route path="/member/memberlist" element={<MemberList />} />
                <Route path="/member/addressbook" element={<AddrMain />} />
                <Route path="/member/addpart" element={<AddPart />} />


                <Route path="/apaper" element={<Apaper />} />

                {/* 이경석 */}
                <Route path="/messenger" element={<Messenger />} />

                {/* 백한결 */}
                <Route path="/approval" element={<Approval />} />
                <Route path="/reportconfirm" element={<Reportconfirm />} />
                <Route path="/approval/view/:approvalNo" element = { <ViewA/> } />
                <Route path="/approval/viewB/:approvalNo" element = { <ViewB/> } />
                <Route path="/approval/myapproval" element = { <Myapproval/> } />

                {/* 김동혁 */}
                <Route path="/list" element={<List />} />
                <Route path="/write" element={<Write />} />
                <Route path="/partboard" element={<PartBoard />} />
                <Route path="/view/:boardNo" element={<View />} />
                <Route path="/update" element={<BoardUpdate />} />
            </Route>
        </Routes>
    );
}




