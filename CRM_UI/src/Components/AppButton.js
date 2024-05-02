import { Button } from 'antd';
import React from 'react';

const AppButton = ({ label, icon, className='', ...props }) => {
    return (
        <div>
            <Button
                icon={icon}
                className={className ? className : 'appButton'}
                {...props}
            >
                {label}
            </Button>
        </div>
    );
}

export default AppButton;