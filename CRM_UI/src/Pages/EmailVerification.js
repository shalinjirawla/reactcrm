import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { getVerifyTenant } from '../Api/Api';
import { message } from 'antd';

const EmailVerification = () => {

    const location = useLocation();
    const { tenantId } = location?.state??{};

    useEffect(() => {
        if (tenantId !== undefined) verifyEmail();
    }, [tenantId]);
    
    const verifyEmail = async () => {
        try {
            const res = await getVerifyTenant(tenantId);
            if (res?.status === 200) {
                return;
            } else {
                message.error(res?.data?.message);
            }
        } catch (error) {
            message.error(error?.respond?.data?.error);
        }
    };
    
    return (
        <div className='mainInsideDivBox'>
            <h2>Email Verification Required</h2>
            <div className='box'>
                <h4>In order to access all the available features in the portal, first you must verify your email. Then you can Login.</h4>
            </div>
        </div>
    );
}

export default EmailVerification;