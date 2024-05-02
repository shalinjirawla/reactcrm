import { Col, Divider, Form, Row } from 'antd';
import React from 'react';
import TextInput from '../TextInput';
import Selectable from '../Selectable';
import AppButton from '../AppButton';
import { contactTypeList } from '../../Constants';
import { useSelector } from 'react-redux';
import { countryData } from '../../Json/Country';
import { getSelectLabel, getSelectOptionData } from '../../Helper';

const AddEditContactForm = ({
    setContactModalOpen,
    defaultContact,
    handleContactFormValues
}) => {

    const { accountData } = useSelector((state) => state.userData) ?? {};
    const [contactAddForm] = Form.useForm();
    
    const labelRender = (item) => {
        item.title = contactTypeList?.find(o => o?._id === item.value)?.color;
        return getSelectLabel(item);
    };

    return (
        <div>
            <Divider />
            <Form
                preserve={false}
                form={contactAddForm}
                name='addUserForm'
                className='addUserForm'
                layout='vertical'
            >
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Full name'
                            name='addContactName'
                            defaultVal={defaultContact?.contactName}
                            type='text'
                            required={true}
                            requiredMsg='Name is required!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Account'
                            name='addContactAccount'
                            defaultVal={defaultContact?.account}
                            required={false}
                            requiredMsg='Account is required!'
                            data={accountData}
                            firstName='accountName'
                            showSearch={true}
                            handleSelectChange={(val) => {}}
                            options={(accountData || []).map(o => ({
                                value: o.accountName
                            }))}
                            allowClear={true}
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Full job title'
                            name='addContactJobTitle'
                            defaultVal={defaultContact?.jobTitle}
                            type='text'
                            required={false}
                            requiredMsg='Job title is required!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Email'
                            name='addContactEmail'
                            defaultVal={defaultContact?.email}
                            type='email'
                            required={true}
                            requiredMsg='Email is required!'
                            typeMsg='Enter a valid Email!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Mobile number'
                            name='addContactMobile'
                            defaultVal={defaultContact?.mobileNumber}
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
                <Row justify='space-between'>
                    <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <Selectable
                            label='Country'
                            name='addContactCountry'
                            defaultVal={defaultContact?.country}
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
                    <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <Selectable
                            label='Type'
                            name='addContactType'
                            defaultVal={defaultContact?.typeId}
                            required={false}
                            requiredMsg='Type is required!'
                            data={contactTypeList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                            allowClear={true}
                            options={(contactTypeList || []).map(o => ({
                                value: o._id,
                                label: o.name,
                                tagColor: o.color
                            }))}
                            optionRender={getSelectOptionData}
                            labelRender={labelRender}
                            popupClassName='renderLabel'
                        />
                    </Col>
                </Row>
                <Divider />

                <Row justify='end'>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Row justify='end'>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Save'
                                    className='appPrimaryButton formWidth'
                                    onClick={() => {
                                        handleContactFormValues(contactAddForm);
                                    }}
                                />
                            </Col>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Cancel'
                                    className='appButton formWidth'
                                    onClick={() => {
                                        contactAddForm.resetFields();
                                        setContactModalOpen(false);
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

export default AddEditContactForm;