import { Modal } from 'antd';
import React from 'react';

const AppModal = ({ children, open, title = null, footer = false, width, height, onOk, onCancel, ...props }) => {
    return (
        <div>
            <Modal
                {...props}
                open={open}
                title={title}
                onOk={onOk}
                bodyStyle={{ height: height }}
                style={{ borderRadius: '7px' }}
                footer={footer}
                destroyOnClose
                width={width}
                onCancel={onCancel}
                className='appModal'
            >
                {children}
            </Modal>
        </div>
    );
}

export default AppModal;