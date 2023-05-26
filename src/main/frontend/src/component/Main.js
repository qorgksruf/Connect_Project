import React , { useState , useEffect } from 'react';
import { BrowserRouter , Routes , Route , Outlet } from 'react-router-dom';
import styles from './css/main/main.css';
// --------------------------- //

import Header from './Header';
import Dial from './Dial';

export default function Main( props ){

    return (<>
        <Header />
        <Outlet />
        <Dial />
    </>);
}