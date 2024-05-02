import { Divider, Popover, message } from 'antd';
import React, { useState } from 'react';
import AppModal from './AppModal';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import { BsThreeDots } from "react-icons/bs";
import { FaFileExport } from "react-icons/fa";
import { FaFileImport } from "react-icons/fa";
import { getSampleData, importExcelData } from '../Api/Api';
import { parseData } from '../Helper';
import AppButton from './AppButton';
import { roleList } from '../Constants';

const ImportExport = ({ handleExport, fetchData, screenType }) => {

    const { currentRole, currUserData, rsWidths: { is620, is930, is1100 }, isMobile, isTablet } = useContext(AuthContext) ?? {};
    const [importFileModalOpen, setImportFileModalOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleImportFileModal = () => {
        setImportFileModalOpen(!importFileModalOpen);
    };
    
    const handleVisibleChange = (visible) => {
        setVisible(visible);
    };

    const handleImport = async (e) => {
        e.preventDefault();
        const files = e.target.files[0];

        try {
            const formData = new FormData();
            formData.append('file', files);
            formData.append('module', screenType);

            if (currentRole === 'HostAdmin' || currentRole === 'HostUser' || currentRole === 'Admin' || currentRole === 'User') {
                if (screenType === 'User') formData.append('roleId', roleList?.find(o => o.name === 'HostUser')?._id);
                else {
                    formData.append('roleId', parseData(currUserData)?.roleId);
                    formData.append('userId', parseData(currUserData)?.id);
                }
            } else {
                if (screenType === 'User') formData.append('roleId', roleList?.find(o => o.name === 'User')?._id);
                else {
                    formData.append('roleId', 0);
                    formData.append('userId', 0);
                }
            }

            if (currentRole === 'HostAdmin' || currentRole === 'HostUser') {
                formData.append('tenantId', 0);
            } else if (currentRole === 'Admin' || currentRole === 'User') {
                formData.append('tenantId', parseData(currUserData)?.tenantId);
            } else {
                formData.append('tenantId', parseData(currUserData)?.id);
            }
            
            const res = await importExcelData(formData);
            if (res?.status === 201) {
                setImportFileModalOpen(false);
                message.success(res?.data?.message);
                fetchData();
                return;
            } else {
                message.error('Failed to upload Excel file.');
            }
        } catch (error) {
            message.error('An error occurred while uploading the Excel file. Please try again later.');
        }
    };

    const content = <>
        <div className='popover-content'>
            <div onClick={() => { handleExport(); setVisible(false); }}><FaFileExport /> &nbsp;<label className='cursorP'>Export to Excel</label></div>
            <div onClick={() => { setImportFileModalOpen(true); setVisible(false); }} className='mTop-Content'><FaFileImport /> &nbsp;<label className='cursorP'>Import from Excel</label></div>  
        </div>
    </>;

    const handleDownload = async () => {
        const res = await getSampleData(screenType);
        exportExcelResponse(res);
        setImportFileModalOpen(false);
    };

    const handleImportFile = <>
        <Divider />
        <input 
            required
            type="file" 
            name="file" 
            onChange={handleImport}
            accept=".xlsx, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        /> <br /><br />

        <h3>Download the Sample Excel File</h3>
        <AppButton label='Download' className='downloadBtn' onClick={handleDownload} />
    </>;

    return (
        <>
            <Popover 
                content={content}
                trigger='click'
                placement='bottomLeft'
                arrow={false}
                open={visible}
                onOpenChange={handleVisibleChange}
            >
                <div className={`popover-bg ${visible ? 'active' : ''}`} onClick={() => setVisible(!visible)}><BsThreeDots /></div>
            </Popover>

            <AppModal
                title='Import File'
                open={importFileModalOpen}
                children={handleImportFile}
                width={isMobile ? '55%' : is620 ? '50%' : isTablet ? '45%' : is930 ? '40%' : is1100 ? '35%' : '30%'}
                onOk={handleImportFileModal}
                onCancel={handleImportFileModal}
            />
        </>
    );
}

export default ImportExport;

export const exportExcelResponse = (res) => {
    if (res?.status === 201) {
        var binaryData = atob(res?.data?.data);

        const blob = new Blob([new Uint8Array(binaryData.length).map((_, index) => binaryData.charCodeAt(index))], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = res?.data?.fileName;
        a.click();

        window.URL.revokeObjectURL(url);
        message.success(res?.data?.message);
        return;
    }
};