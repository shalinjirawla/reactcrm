import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import AppButton from './AppButton';
import Selectable from './Selectable';
import { filterSelectData } from '../Constants';

const FilterBox = ({
    active,
    isCard = false,
    handleChangeFilterInput,
    onFilterValues,
    onChangeActiveFilter,
    extraFilter = false,
    extraFilterBox,
    labelName = false
}) => {
    return (
        <div>
            <Row className={(isCard ? 'filterBox' : '') || (labelName ? 'labelRangeStyle' : '')}>
                <Row className={labelName ? 'labelRangeStyle' : 'firstRow'} align='bottom' justify='space-between'>
                    <Col xl={16} lg={16} md={16} sm={16} xs={16} className='searchCategoryDiv'>
                        <Row>
                            <Col xl={22} md={22} sm={22} xs={22}>
                                <Form>
                                {/* <TextInput className='searchInput' placeholder='Search here...' onChange={(e) => handleChangeFilterInput(e)} /> */}
                                    <Input className='searchInput' placeholder='Search here...' onChange={(e) => handleChangeFilterInput(e)} />
                                </Form>
                            </Col>
                            <Col xl={2} md={2} sm={2} xs={2}>
                                <AppButton label='Filter' className='filterBtn' onClick={() => onFilterValues()} />
                            </Col>
                        </Row>
                    </Col>
                    {(active === true || active === false) &&
                        <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                            <Form>
                                <Selectable
                                    name='isActiveFilter'
                                    defaultVal={active ? '1' : '0'}
                                    firstName='name'
                                    data={filterSelectData}
                                    onChange={onChangeActiveFilter}
                                />
                            </Form>
                        </Col>
                    }
                    {extraFilter &&
                        <>
                            {extraFilterBox}
                        </>
                    }
                </Row>
            </Row>
        </div>
    );
}

export default FilterBox;