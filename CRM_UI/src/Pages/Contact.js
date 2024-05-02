import { Col, Input, Modal, Row, Table, Tag, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppButton from '../Components/AppButton';
import AppModal from '../Components/AppModal';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addContact, deleteContact, getAllContact, getAllContactByTenant, getAllContactByTenantAdmin, getAllContactByUser, getExportExcelFileByContact, importExcelData, updateContact } from '../Api/Api';
import { contactTypeList } from '../Constants';
import AddEditContactForm from '../Components/Contact/AddEditContactForm';
import { useDispatch } from 'react-redux';
import { setContactData } from '../Redux/Features/UserDataSlice';
import { AuthContext } from '../Context/AuthProvider';
import { filterData, parseData } from '../Helper';
import ImportExport, { exportExcelResponse } from '../Components/ImportExport';

const Contact = ({ screenType }) => {

    const contactColumns = [
        {
            key: 'contactName',
            title: 'Full name',
            dataIndex: 'contactName',
            fixed: 'left',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: 'account',
            title: 'Account',
            dataIndex: 'account',
            render: (val) => val ? <div>{val}</div> : <div></div>
        },
        {
            key: 'typeId',
            title: 'Type',
            dataIndex: 'typeId',
            render: (val) => val ? <div><Tag className='tagFont' color={getTypeTagColor(val)}>{contactTypeList.find(o => o?._id === val)?.name}</Tag></div> : <div></div>
        },
        {
            key: 'email',
            title: 'Email',
            dataIndex: 'email',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: 'mobileNumber',
            title: 'Mobile Number',
            dataIndex: 'mobileNumber',
            render: (val) => val ? <div>{val}</div> : <div></div>
        },
        {
            key: 'country',
            title: 'Country',
            dataIndex: 'country',
            render: (val) => val ? <div>{val}</div> : <div></div>
        },
        {
            key: 'action',
            title: 'Action',
            dataIndex: 'action',
            width: '5%',
            render: (index, record) => <div className='d-flex-between'>
                <EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)}/>
                <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
            </div>
        },
    ];

    const dispatch = useDispatch();
    const { currentRole, currUserData, rsWidths: { is620, is930, is1100, is1200 }, isMobile, isTablet } = useContext(AuthContext) ?? {};
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [defaultContact, setDefaultContact] = useState(null);
    const [isEditContact, setIsEditContact] = useState(false);
    const [contactList, setContactList] = useState([]);
    const [filterTable, setFilterTable] = useState(null);

    const onSearch = (value) => {
        const temp = filterData(contactList, value);
        setFilterTable(temp);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        let res;
        if (currentRole === 'HostAdmin') {
            res = await getAllContact();
        } else if (currentRole === 'Admin') {
            res = await getAllContactByTenantAdmin(parseData(currUserData)?.tenantId);
        } else if (currentRole === 'HostUser' || currentRole === 'User') {
            res = await getAllContactByUser(parseData(currUserData)?.id);
        } else if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') {
            res = await getAllContactByTenant(parseData(currUserData)?.id);
        }
        if (res?.status === 200) {
            setContactList(res?.data);
            dispatch(setContactData(res?.data));
        }
    };

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: `Contact name: ${record?.contactName}`,
            content: 'Are you sure want to remove this Contact?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deleteContact(record?.id);
                    if (res?.data === true) {
                        message.success(record?.contactName + ' Contact Deleted Successfully !!!');
                        fetchContacts();
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error('Something went wrong' + error);
                }
            },
            onCancel() { },
        });
    };

    const onEditRow = async (record, isDelete = false) => {
        if (!isDelete) {
            setContactModalOpen(true);
            setDefaultContact(record);
            setIsEditContact(true);
        }
        if (isDelete) {
            showDeleteConfirm(record);
            return;
        }
    };

    const getTypeTagColor = (val) => {
        return contactTypeList?.find(o => o._id === val)?.color;
    };

    const handleContactModal = () => {
        setContactModalOpen(!contactModalOpen);
    };

    const handleContactFormValues = async (form) => {
        const { addContactName, addContactAccount, addContactJobTitle, addContactEmail, addContactMobile, addContactCountry, addContactType } = form.getFieldsValue();

        if (addContactName && addContactEmail) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }
            
            let data = {
                contactName: addContactName,
                account: addContactAccount ? addContactAccount : '',
                jobTitle: addContactJobTitle ? addContactJobTitle : '',
                email: addContactEmail,
                mobileNumber: addContactMobile ? addContactMobile : '',
                country: addContactCountry ? addContactCountry : '',
                typeId: addContactType ? addContactType : null
            };

            if (currentRole === 'HostAdmin' || currentRole === 'HostUser') {
                data['tenantId'] = null;
            } else if (currentRole === 'Admin' || currentRole === 'User') {
                data['tenantId'] = parseData(currUserData)?.tenantId;
            } else {
                data['tenantId'] = parseData(currUserData)?.id;
            }

            if (!isEditContact) {
                if (currentRole === 'HostAdmin' || currentRole === 'HostUser' || currentRole === 'Admin' || currentRole === 'User') {
                    data['roleId'] = parseData(currUserData)?.roleId;
                    data['userId'] = parseData(currUserData)?.id;
                } else {
                    data['roleId'] = null;
                    data['userId'] = null;
                }
            } else {
                data['roleId'] = defaultContact?.roleId;
                data['userId'] = defaultContact?.userId;
            }

            if (defaultContact) {
                data['id'] = defaultContact?.id;
            }

            if (!isEditContact) {
                try {
                    data['createdOn'] = new Date().toLocaleString();
                    const res = await addContact(data);
                    if (res?.status === 200) {
                        setContactModalOpen(false);
                        message.success('Contact Added Successfully !!!');
                        fetchContacts();
                        return;
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error(error?.respond?.data?.error);
                }
            }

            if (isEditContact) {
                try {
                    const res = await updateContact(data);
                    if (res?.status === 200) {
                        setContactModalOpen(false);
                        message.success(defaultContact?.contactName + ' Contact Updated Successfully !!!');
                        fetchContacts();
                        return;
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error(error?.respond?.data?.error);
                }
            }

        } else {
            message.error('Please Add Required Fields!')
        }
    };

    const handleExport = async () => {
        let res;
        if (currentRole === 'HostAdmin') res = await getExportExcelFileByContact();
        if (currentRole === 'Admin') res = await getExportExcelFileByContact(null, parseData(currUserData)?.tenantId);
        if (currentRole === 'HostUser' || currentRole === 'User') res = await getExportExcelFileByContact(null, null, parseData(currUserData)?.id);
        if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') res = await getExportExcelFileByContact(parseData(currUserData)?.id);
        exportExcelResponse(res);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                    <h2 className='allPageHeader'>Contacts</h2>
                </Col>
                <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <Row justify='end'>
                        <Col xl={20} lg={20} md={20} sm={20} xs={20}>
                            <AppButton
                                className='appPrimaryButton tabBtn'
                                icon={<PlusOutlined />}
                                label='Add Contact'
                                onClick={() => {
                                    setContactModalOpen(true);
                                    setDefaultContact(null);
                                    setIsEditContact(false);
                                }}
                            />
                        </Col>
                        <Col xl={4} lg={4} md={4} sm={4} xs={4} className='d-flex'>
                            <ImportExport handleExport={handleExport} fetchData={fetchContacts} screenType={screenType} />
                        </Col>
                    </Row>
                </Col>
            </Row><br /><br />
            <Row align='middle' justify='end'>
                <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                    <Row>
                        <Input.Search
                            placeholder='Search'
                            enterButton
                            onSearch={onSearch}
                        />
                    </Row>
                </Col>
            </Row><br /><br />

            <Table
                columns={contactColumns}
                dataSource={filterTable === null ? contactList : filterTable}
                pagination={{ showSizeChanger: true }}
                scroll={is1200 && { x: 'calc(700px + 50%)' }}
            />
            <AppModal
                title={isEditContact ? 'Update Contact' : 'Add Contact'}
                open={contactModalOpen}
                children={
                    <AddEditContactForm
                        setContactModalOpen={setContactModalOpen}
                        defaultContact={defaultContact}
                        handleContactFormValues={handleContactFormValues}
                    />
                }
                width={isMobile ? '55%' : is620 ? '50%' : isTablet ? '45%' : is930 ? '40%' : is1100 ? '35%' : '30%'}
                onOk={handleContactModal}
                onCancel={handleContactModal}
            />
        </div>
    );
}

export default Contact;