import { Col, Divider, Form, Input, Row } from 'antd';
import React from 'react';
import Selectable from '../Selectable';
import AppButton from '../AppButton';
import { accountCategoryList, accountIndustryList, accountTypeList } from '../../Constants';
import { useSelector } from 'react-redux';
import TextInput from '../TextInput';
import { countryData } from '../../Json/Country';
import { getSelectLabel, getSelectOptionData } from '../../Helper';

const AddEditAccountForm = ({
    setAccountModalOpen,
    defaultAccount,
    handleAccountFormValues,
    isEditAccount
}) => {

    const { contactData } = useSelector((state) => state.userData) ?? {};
    const [AccountAddForm] = Form.useForm();

    const labelRender = (item, type) => {
        if (type === 'accountType') {
            item.title = accountTypeList?.find(o => o?._id === item.value)?.color;
            return getSelectLabel(item);
        } else if (type === 'accountCategory') {
            item.title = accountCategoryList?.find(o => o?._id === item.value)?.color;
            return getSelectLabel(item, 'borderTag');
        }
    };

    return (
        <div>
            <Divider />
            <Form
                preserve={false}
                form={AccountAddForm}
                name='addUserForm'
                className='addUserForm'
                layout='vertical'
            >
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Name'
                            name='addAccountName'
                            defaultVal={defaultAccount?.accountName}
                            type='text'
                            required={true}
                            requiredMsg='Name is required!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Primary contact'
                            name='addAccountContact'
                            defaultVal={defaultAccount?.contact}
                            required={false}
                            requiredMsg='Contact is required!'
                            data={contactData}
                            firstName='contactName'
                            showSearch={true}
                            handleSelectChange={(val) => {}}
                            options={(contactData || []).map(o => ({
                                value: o.contactName
                            }))}
                            allowClear={true}
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={!isEditAccount ? 24 : 11} lg={!isEditAccount ? 24 : 11} md={!isEditAccount ? 24 : 11} sm={!isEditAccount ? 24 : 11} xs={!isEditAccount ? 24 : 11}>
                        <Selectable
                            label='Type'
                            name='addAccountType'
                            defaultVal={defaultAccount?.typeId}
                            required={false}
                            requiredMsg='Type is required!'
                            data={accountTypeList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                            allowClear={true}
                            options={(accountTypeList || []).map(o => ({
                                value: o._id,
                                label: o.name,
                                tagColor: o.color
                            }))}
                            optionRender={getSelectOptionData}
                            labelRender={(item) => labelRender(item, 'accountType')}
                            popupClassName='renderLabel'
                        />
                    </Col>
                    {isEditAccount && <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <Selectable
                            label='Category'
                            name='addAccountCategory'
                            defaultVal={defaultAccount?.categoryId}
                            required={false}
                            requiredMsg='Category is required!'
                            data={accountCategoryList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                            allowClear={true}
                            options={(accountCategoryList || []).map(o => ({
                                value: o._id,
                                label: o.name,
                                tagColor: o.color
                            }))}
                            optionRender={(item) => getSelectOptionData(item, 'index', 'borderTag')}
                            labelRender={(item) => labelRender(item, 'accountCategory')}
                            popupClassName='renderLabel'
                        />
                    </Col>}
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Industry'
                            name='addAccountIndustry'
                            defaultVal={defaultAccount?.industryId}
                            required={false}
                            requiredMsg='Industry is required!'
                            data={accountIndustryList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                            allowClear={true}
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            label='Web'
                            name='addAccountWeb'
                            initialValue={defaultAccount?.web}
                            rules={[
                                { required: false, message: 'Web is required!' },
                                { type: 'url' , warningOnly: true }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Primary phone'
                            name='addAccountMobile'
                            defaultVal={defaultAccount?.mobileNumber}
                            type='text'
                            required={false}
                            requiredMsg='Mobile Number is required!'
                            typeMsg='Enter a valid Mobile Number!'
                            min={10}
                            max={10}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Col>
                </Row>
                {isEditAccount && <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Country'
                            name='addAccountCountry'
                            defaultVal={defaultAccount?.country}
                            required={false}
                            requiredMsg='Country is required!'
                            data={countryData}
                            firstName='name'
                            showSearch={true}
                            handleSelectChange={(val) => {}}
                            options={(countryData || []).map(o => ({
                                value: o.name
                            }))}
                            allowClear={true}
                        />
                    </Col>
                </Row>}
                <Divider />

                <Row justify='end'>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Row justify='end'>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Save'
                                    className='appPrimaryButton formWidth'
                                    onClick={() => {
                                        handleAccountFormValues(AccountAddForm);
                                    }}
                                />
                            </Col>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Cancel'
                                    className='appButton formWidth'
                                    onClick={() => {
                                        AccountAddForm.resetFields();
                                        setAccountModalOpen(false);
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default AddEditAccountForm;