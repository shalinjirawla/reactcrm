import { Card, Col, Row } from 'antd';
import React from 'react';

const NumbersCard = ({ name, count }) => {
    return (
        <Col xl={6} lg={6} md={6} sm={6} xs={6} className='!marginCardAuto'>
            <Card className='countCard'>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <h3 className='cardHeading'>{name}</h3>
                    </Col>
                </Row><br />
                <Row>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <h1>{count}</h1>
                    </Col>
                </Row>
            </Card>
        </Col>
    );
}

export default NumbersCard;