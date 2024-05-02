import { Col, Input, Modal, Row, Table, message, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppButton from '../Components/AppButton';
import AppModal from '../Components/AppModal';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addAccount, deleteAccount, getAllAccount, getAllAccountByTenant, getAllAccountByTenantAdmin, getAllAccountByUser, getExportExcelFileByAccount, importExcelData, updateAccount } from '../Api/Api';
import { accountCategoryList, accountIndustryList, accountTypeList } from '../Constants';
import { filterData, parseData } from '../Helper';
import { AuthContext } from '../Context/AuthProvider';
import AddEditAccountForm from '../Components/Account/AddEditAccountForm';
import { useDispatch } from 'react-redux';
import { setAccountData } from '../Redux/Features/UserDataSlice';
import ImportExport, { exportExcelResponse } from '../Components/ImportExport';

const Account = ({ screenType }) => {

    const accountColumns = [
        {
            key: 'accountName',
            title: 'Name',
            dataIndex: 'accountName',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: 'contact',
            title: 'Primary contact',
            dataIndex: 'contact',
            render: (val) => val ? <div>{val}</div> : <div></div>
        },
        {
            key: 'typeId',
            title: 'Type',
            dataIndex: 'typeId',
            render: (val) => val ? <div><Tag className='tagFont' color={getTypeTagColor(val)}>{accountTypeList?.find(o => o?._id === val)?.name}</Tag></div> : <div></div>
        },
        {
            key: 'categoryId',
            title: 'Category',
            dataIndex: 'categoryId',
            render: (val) => val ? <div><Tag className='borderTag' color={getCategoryTagColor(val)}>{accountCategoryList?.find(o => o?._id === val)?.name}</Tag></div> : <div></div>
        },
        {
            key: 'industryId',
            title: 'Industry',
            dataIndex: 'industryId',
            render: (val) => val ? <div>{accountIndustryList?.find(o => o?._id === val)?.name}</div> : <div></div>
        },
        {
            key: 'web',
            title: 'Web',
            dataIndex: 'web',
            render: (val) => val ? <div>{val}</div> : <div></div>
        },
        {
            key: 'country',
            title: 'Country',
            dataIndex: 'country',
            render: (val) => val ? <div>{val}</div> : <div></div>
        },
        {
            key: 'createdOn',
            title: 'Created on',
            dataIndex: 'createdOn',
            render: (val) => val ? <div>{new Date(val).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false }).replace(',', '')}</div> : <div></div>
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
    const [accountModalOpen, setAccountModalOpen] = useState(false);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [isEditAccount, setIsEditAccount] = useState(false);
    const [accountList, setAccountList] = useState([]);
    const [filterTable, setFilterTable] = useState(null);

    const onSearch = (value) => {
        const temp = filterData(accountList, value);
        setFilterTable(temp);
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        let res;
        if (currentRole === 'HostAdmin') {
            res = await getAllAccount();
        } else if (currentRole === 'Admin') {
            res = await getAllAccountByTenantAdmin(parseData(currUserData)?.tenantId);
        } else if (currentRole === 'HostUser' || currentRole === 'User') {
            res = await getAllAccountByUser(parseData(currUserData)?.id);
        } else if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') {
            res = await getAllAccountByTenant(parseData(currUserData)?.id);
        }
        if (res?.status === 200) {
            setAccountList(res?.data);
            dispatch(setAccountData(res?.data));
        }
    };

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: `Account name: ${record?.accountName}`,
            content: 'Are you sure want to remove this Account?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deleteAccount(record?.id);
                    if (res?.data === true) {
                        message.success(record?.accountName + "'s Account Deleted Successfully !!!");
                        fetchAccounts();
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
            setAccountModalOpen(true);
            setDefaultAccount(record);
            setIsEditAccount(true);
        }
        if (isDelete) {
            showDeleteConfirm(record);
            return;
        }
    };

    const getTypeTagColor = (val) => {
        return accountTypeList?.find(o => o?._id === val)?.color;
    };

    const getCategoryTagColor = (val) => {
        return accountCategoryList?.find(o => o?._id === val)?.color;
    };

    const handleAccountModal = () => {
        setAccountModalOpen(!accountModalOpen);
    };

    const handleAccountFormValues = async (form) => {
        const { addAccountName, addAccountContact, addAccountType, addAccountCategory, addAccountIndustry, addAccountWeb, addAccountMobile, addAccountCountry } = form.getFieldsValue();

        if (addAccountName) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = {
                accountName: addAccountName,
                contact: addAccountContact ? addAccountContact : '',
                typeId: addAccountType ? addAccountType : null,
                categoryId: addAccountCategory ? addAccountCategory : null,
                industryId: addAccountIndustry ? addAccountIndustry : null,
                web: addAccountWeb ? addAccountWeb : '',
                mobileNumber: addAccountMobile ? addAccountMobile : '',
                country: addAccountCountry ? addAccountCountry : ''
            };

            if (currentRole === 'HostAdmin' || currentRole === 'HostUser') {
                data['tenantId'] = null;
            } else if (currentRole === 'Admin' || currentRole === 'User') {
                data['tenantId'] = parseData(currUserData)?.tenantId;
            } else {
                data['tenantId'] = parseData(currUserData)?.id;
            }

            if (!isEditAccount) {
                if (currentRole === 'HostAdmin' || currentRole === 'HostUser' || currentRole === 'Admin' || currentRole === 'User') {
                    data['roleId'] = parseData(currUserData)?.roleId;
                    data['userId'] = parseData(currUserData)?.id;
                } else {
                    data['roleId'] = null;
                    data['userId'] = null;
                }
            } else {
                data['roleId'] = defaultAccount?.roleId;
                data['userId'] = defaultAccount?.userId;
            }

            if (defaultAccount) {
                data['id'] = defaultAccount?.id;
            }

            if (!isEditAccount) {
                try {
                    data['createdOn'] = new Date().toLocaleString();
                    const res = await addAccount(data);
                    if (res?.status === 200) {
                        setAccountModalOpen(false);
                        message.success('Account Added Successfully !!!');
                        fetchAccounts();
                        return;
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error(error?.respond?.data?.error);
                }
            }

            if (isEditAccount) {
                try {
                    const res = await updateAccount(data);
                    if (res?.status === 200) {
                        setAccountModalOpen(false);
                        message.success(defaultAccount?.accountName + "'s Account Updated Successfully !!!");
                        fetchAccounts();
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
        if (currentRole === 'HostAdmin') res = await getExportExcelFileByAccount();
        if (currentRole === 'Admin') res = await getExportExcelFileByAccount(null, parseData(currUserData)?.tenantId);
        if (currentRole === 'HostUser' || currentRole === 'User') res = await getExportExcelFileByAccount(null, null, parseData(currUserData)?.id);
        if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') res = await getExportExcelFileByAccount(parseData(currUserData)?.id);
        exportExcelResponse(res);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                    <h2 className='allPageHeader'>Accounts</h2>
                </Col>
                <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <Row justify='end'>
                        <Col xl={20} lg={20} md={20} sm={20} xs={20}>
                            <AppButton
                                className='appPrimaryButton tabBtn'
                                icon={<PlusOutlined />}
                                label='Add Account'
                                onClick={() => {
                                    setAccountModalOpen(true);
                                    setDefaultAccount(null);
                                    setIsEditAccount(false);
                                }}
                            />
                        </Col>
                        <Col xl={4} lg={4} md={4} sm={4} xs={4} className='d-flex'>
                            <ImportExport handleExport={handleExport} fetchData={fetchAccounts} screenType={screenType} />
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
                columns={accountColumns}
                dataSource={filterTable === null ? accountList : filterTable}
                pagination={{ showSizeChanger: true }}
                scroll={is1200 && { x: 'calc(700px + 50%)' }}
            />
            <AppModal
                title={isEditAccount ? 'Update Account' : 'Add Account'}
                open={accountModalOpen}
                children={
                    <AddEditAccountForm
                        setAccountModalOpen={setAccountModalOpen}
                        defaultAccount={defaultAccount}
                        handleAccountFormValues={handleAccountFormValues}
                        isEditAccount={isEditAccount}
                    />
                }
                width={isMobile ? '55%' : is620 ? '50%' : isTablet ? '45%' : is930 ? '40%' : is1100 ? '35%' : '30%'}
                onOk={handleAccountModal}
                onCancel={handleAccountModal}
            />
        </div>
    );
}

export default Account;