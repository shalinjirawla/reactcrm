import { Col, DatePicker, Divider, Form, InputNumber, Row } from 'antd';
import React from 'react';
import TextInput from '../TextInput';
import Selectable from '../Selectable';
import AppButton from '../AppButton';
import { opportunitySalesChannelList, opportunityStageList } from '../../Constants';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';

const AddEditOpportunityForm = ({
    setOpportunityModalOpen,
    defaultOpportunity,
    handleOpportunityFormValues,
    isEditOpportunity
}) => {

    const { contactData, accountData } = useSelector((state) => state.userData) ?? {};
    const [opportunityAddForm] = Form.useForm();

    const getDefaultStageValue = () => {
        if (!defaultOpportunity) {
            return opportunityStageList?.find(o => o?.name === 'Qualification')?._id;
        }
        return defaultOpportunity?.stageId;
    };

    return (
        <div>
            <Divider />
            <Form
                preserve={false}
                form={opportunityAddForm}
                name='addUserForm'
                className='addUserForm'
                layout='vertical'
            >
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Name'
                            name='addOpportunityName'
                            defaultVal={defaultOpportunity?.name}
                            type='text'
                            required={true}
                            requiredMsg='Name is required!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Contact'
                            name='addOpportunityContact'
                            defaultVal={defaultOpportunity?.contact}
                            required={true}
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
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Account'
                            name='addOpportunityAccount'
                            defaultVal={defaultOpportunity?.account}
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
                    <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <Form.Item
                            label='Total contract value'
                            name='addOpportunityContractValue'
                            initialValue={defaultOpportunity?.contractValue}
                            required={false}
                            requiredMsg='Contract Value is required!'
                        >
                            <InputNumber
                                className='inputNumber'
                                controls={false}
                                formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <Form.Item
                            label='Expected Close Date'
                            name='addOpportunityCloseDate'
                            initialValue={defaultOpportunity?.closeDate ? dayjs(new Date(defaultOpportunity?.closeDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : ''}
                            rules={[{ required: false, message: 'Close Date is required!'}]}
                        >
                            <DatePicker
                                className='datePicker'
                                placeholder=''
                                format='DD/MM/YYYY'
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={!isEditOpportunity ? 24 : 11} lg={!isEditOpportunity ? 24 : 11} md={!isEditOpportunity ? 24 : 11} sm={!isEditOpportunity ? 24 : 11} xs={!isEditOpportunity ? 24 : 11}>
                        <Selectable
                            label='Stage'
                            name='addOpportunityStage'
                            defaultVal={getDefaultStageValue()}
                            required={true}
                            requiredMsg='Stage is required!'
                            data={opportunityStageList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                        />
                    </Col>
                    {isEditOpportunity && <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <Selectable
                            label='Sales channel'
                            name='addOpportunitySalesChannel'
                            defaultVal={defaultOpportunity?.salesChannelId}
                            required={false}
                            requiredMsg='Sales channel is required!'
                            data={opportunitySalesChannelList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                            allowClear={true}
                        />
                    </Col>}
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            label='Description'
                            name='addOpportunityDescription'
                            initialValue={defaultOpportunity?.description}
                            type='text'
                            required={false}
                            requiredMsg='Description is required!'
                        >
                            <TextArea rows={1} />
                        </Form.Item>
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
                                        handleOpportunityFormValues(opportunityAddForm);
                                    }}
                                />
                            </Col>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Cancel'
                                    className='appButton formWidth'
                                    onClick={() => {
                                        opportunityAddForm.resetFields();
                                        setOpportunityModalOpen(false);
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

export default AddEditOpportunityForm;