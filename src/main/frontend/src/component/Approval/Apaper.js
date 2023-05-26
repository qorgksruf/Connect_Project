import React , { useState , useEffect } from 'react';

import styles from '../css/Approval/paper.css';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import {
    Paper , Container
} from '@mui/material'

export default function Apaper( props ) {
    return (<>
        <Container>
            <Paper elevation={3} className="approval-wrap">
                <Container>
                    <div className="top-title">
                        <div className="main-title">
                            <h3> 휴  가  신  청  서 </h3>
                        </div>
                        <div className="approval-member">
                            <table className="approval-table">
                                <tr>
                                    <th rowSpan="2"> 결재 </th>
                                    <th> 부장 </th>
                                    <th> 이사 </th>
                                    <th> 사장 </th>
                                </tr>

                                <tr>
                                     <td> </td>
                                     <td> </td>
                                     <td> </td>
                                </tr>

                            </table>
                        </div>
                    </div>

                    <div className="acontent-box">
                        <table className="acontent">
                            <tr>
                                <th className="apart">부서</th> <td> test </td> <th className="apart">직급</th> <td> test </td>
                            </tr>

                            <tr>
                                <th className="apart">성명</th> <td> test </td> <th className="apart">비상연락망</th> <td> test </td>
                            </tr>

                            <tr>
                                <th className="apart">구분</th> <td colSpan="3"></td>
                            </tr>

                            <tr>
                                <th className="apart">휴가기간</th>
                                <td colSpan="3" className="adatetime">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker />
                                    </LocalizationProvider>
                                        <span className="wave"> ~ </span>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker />
                                    </LocalizationProvider>
                                </td>
                            </tr>

                            <tr>
                                <th className="adetail">세부사항</th> <td colSpan="3"></td>
                            </tr>
                        </table>
                    </div>

                    <div className="acomment">
                        <h3> 위와 같이 휴가를 신청하오니 허락하여 주시기 바랍니다. </h3>
                    </div>
                    <div className="adate">
                        <h3> 년&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;월&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;일 </h3>
                    </div>

                </Container>
            </Paper>
        </Container>
    </>)
}