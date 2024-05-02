import { Col, Divider, Form, Row } from 'antd';
import React from 'react';
import Selectable from '../Selectable';
import AppButton from '../AppButton';
import { leadCustomerNeedList, leadStageList, leadStatusList, leadTypeList } from '../../Constants';
import { useSelector } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';
import { getSelectLabel, getSelectOptionData } from '../../Helper';

const AddEditLeadForm = ({
    setLeadModalOpen,
    defaultLead,
    handleLeadFormValues,
    isEditLead
}) => {

    const { contactData, accountData } = useSelector((state) => state.userData) ?? {};
    const [LeadAddForm] = Form.useForm();

    const getDefaultTypeValue = () => {
        if (!defaultLead) {
            return leadTypeList?.find(o => o?.name === 'PQL')?._id; 
        }
        return defaultLead?.typeId;
    };

    const labelRender = (item) => {
        item.title = leadStatusList?.find(o => o?._id === item.value)?.color;
        return getSelectLabel(item);
    };

    return (
        <div>
            <Divider />
            <Form
                preserve={false}
                form={LeadAddForm}
                name='addUserForm'
                className='addUserForm'
                layout='vertical'
            >
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Customer need'
                            name='addLeadCustomerNeed'
                            defaultVal={defaultLead?.customerNeedId}
                            required={true}
                            requiredMsg='Customer need is required!'
                            data={leadCustomerNeedList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Contact'
                            name='addLeadContact'
                            defaultVal={defaultLead?.contact}
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
                            name='addLeadAccount'
                            defaultVal={defaultLead?.account}
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
                    {isEditLead && <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <Selectable
                            label='Status'
                            name='addLeadStatus'
                            defaultVal={defaultLead?.statusId}
                            required={false}
                            requiredMsg='Status is required!'
                            data={leadStatusList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                            allowClear={true}
                            options={(leadStatusList || []).map(o => ({
                                value: o._id,
                                label: o.name,
                                tagColor: o.color
                            }))}
                            optionRender={getSelectOptionData}
                            labelRender={labelRender}
                            popupClassName='renderLabel'
                        />
                    </Col>}
                    <Col xl={!isEditLead ? 24 : 11} lg={!isEditLead ? 24 : 11} md={!isEditLead ? 24 : 11} sm={!isEditLead ? 24 : 11} xs={!isEditLead ? 24 : 11}>
                        <Selectable
                            label='Lead Type'
                            name='addLeadType'
                            defaultVal={getDefaultTypeValue()}
                            required={false}
                            requiredMsg='Lead Type is required!'
                            data={leadTypeList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                            allowClear={true}
                        />
                    </Col>
                </Row>
                {isEditLead && <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Stage'
                            name='addLeadStage'
                            defaultVal={defaultLead?.stageId}
                            required={false}
                            requiredMsg='Stage is required!'
                            data={leadStageList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                            allowClear={true}
                        />
                    </Col>
                </Row>}
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            label='Comments'
                            name='addLeadComments'
                            initialValue={defaultLead?.comments}
                            type='text'
                            required={false}
                            requiredMsg='Comments is required!'
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
                                        handleLeadFormValues(LeadAddForm);
                                    }}
                                />
                            </Col>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Cancel'
                                    className='appButton formWidth'
                                    onClick={() => {
                                        LeadAddForm.resetFields();
                                        setLeadModalOpen(false);
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

export default AddEditLeadForm;