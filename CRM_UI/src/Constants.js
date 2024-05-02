export const API_HOST = 'https://localhost:44328';

export const filterSelectData = [
    {
        name: 'Active',
        value: 'Active',
        _id: '1'
    },
    {
        name: 'InActive',
        value: 'InActive',
        _id: '0'
    }
];

export const activeStatusList = [
    { id: 1, name: 'Active', _id: 'Active' },
    { id: 2, name: 'InActive', _id: 'InActive' }
];

export const roleList = [
    { id: 1, name: 'HostAdmin', _id: 1 },
    { id: 2, name: 'HostUser', _id: 2 },
    { id: 3, name: 'Admin', _id: 3, type: 'Tenant' },
    { id: 4, name: 'User', _id: 4, type: 'Tenant' }
];

export const contactTypeList = [
    { id: 1, name: 'Contact person', _id: 1, color: 'purple' },
    { id: 2, name: 'Customer', _id: 2, color: 'volcano' },
    { id: 3, name: 'Employee', _id: 3, color: 'green' },
    { id: 4, name: 'Supplier', _id: 4, color: 'blue' }
];

export const taskCategoryList = [
    { id: 1, name: 'Call', _id: 1 },
    { id: 2, name: 'Email', _id: 2 },
    { id: 3, name: 'Meeting', _id: 3 },
    { id: 4, name: 'Paper work', _id: 4 },
    { id: 5, name: 'To do', _id: 5 }
];

export const taskStatusList = [
    { id: 1, name: 'Not started', _id: 1, color: 'purple' },
    { id: 2, name: 'In progress', _id: 2, color: 'blue' },
    { id: 3, name: 'Completed', _id: 3, color: 'green' },
    { id: 4, name: 'Canceled', _id: 4, color: 'volcano' }
];

export const opportunityStageList = [
    { id: 1, name: 'Closed lost', _id: 1 },
    { id: 2, name: 'Closed rejected', _id: 2 },
    { id: 3, name: 'Closed rerouted', _id: 3 },
    { id: 4, name: 'Closed won', _id: 4 },
    { id: 5, name: 'Contracting', _id: 5 },
    { id: 6, name: 'Id. decision makers', _id: 6 },
    { id: 7, name: 'Needs analysis', _id: 7 },
    { id: 8, name: 'Negotiations', _id: 8 },
    { id: 9, name: 'Presentation', _id: 9 },
    { id: 10, name: 'Proposal', _id: 10 },
    { id: 11, name: 'Proposal development', _id: 11 },
    { id: 12, name: 'Qualification', _id: 12 }
];

export const opportunitySalesChannelList = [
    { id: 1, name: 'Direct sale', _id: 1 },
    { id: 2, name: 'Partner sale', _id: 2 }
];

export const leadCustomerNeedList = [
    { id: 1, name: 'Additional service', _id: 1 },
    { id: 2, name: 'Bulk email management system', _id: 2 },
    { id: 3, name: 'Hardware', _id: 3 },
    { id: 4, name: 'Marketing management system', _id: 4 },
    { id: 5, name: 'Need for our products', _id: 5 },
    { id: 6, name: 'Need for our services', _id: 6 },
    { id: 7, name: 'Opportunity management system', _id: 7 },
    { id: 8, name: 'Service management system', _id: 8 },
    { id: 9, name: 'Software', _id: 9 },
    { id: 10, name: 'Workflow automation system', _id: 10 }
];

export const leadStatusList = [
    { id: 1, name: 'Contacted', _id: 1, color: 'blue' },
    { id: 2, name: 'Done', _id: 2, color: 'green' },
    { id: 3, name: 'In progress', _id: 3, color: 'volcano' },
    { id: 4, name: 'Lost', _id: 4, color: 'red' },
    { id: 5, name: 'New', _id: 5, color: 'cyan' },
    { id: 6, name: 'Unable to connect', _id: 6, color: 'purple' }
];

export const leadTypeList = [
    { id: 1, name: 'Added manually', _id: 1 },
    { id: 2, name: 'Content', _id: 2 },
    { id: 3, name: 'Events', _id: 3 },
    { id: 4, name: 'HQL', _id: 4 },
    { id: 5, name: 'Inbound marketing', _id: 5 },
    { id: 6, name: 'Outbound marketing', _id: 6 },
    { id: 7, name: 'Partners', _id: 7 },
    { id: 8, name: 'PQL', _id: 8 },
    { id: 9, name: 'Referrals', _id: 9 }
];

export const leadStageList = [
    { id: 1, name: 'Awaiting sale', _id: 1 },
    { id: 2, name: 'Closed lost', _id: 2 },
    { id: 3, name: 'Converted', _id: 3 },
    { id: 4, name: 'Disqualified', _id: 4 },
    { id: 5, name: 'Handoff to sales', _id: 5 },
    { id: 6, name: 'Marketing qualified lead', _id: 6 },
    { id: 7, name: 'Not interested', _id: 7 },
    { id: 8, name: 'Nurturing', _id: 8 },
    { id: 9, name: 'Qualification', _id: 9 },
    { id: 10, name: 'Sales qualified lead', _id: 10 },
    { id: 11, name: 'Satisfied', _id: 11 }
];

export const accountTypeList = [
    { id: 1, name: 'Competitor', _id: 1, color: 'volcano' },
    { id: 2, name: 'Contractor', _id: 2, color: 'cyan' },
    { id: 3, name: 'Customer', _id: 3, color: 'green' },
    { id: 4, name: 'Our Company', _id: 4, color: 'purple' },
    { id: 5, name: 'Partner', _id: 5, color: 'blue' },
    { id: 6, name: 'Supplier', _id: 6, color: 'red' }
];

export const accountCategoryList = [
    { id: 1, name: 'A', _id: 1, color: 'volcano' },
    { id: 2, name: 'B', _id: 2, color: 'green' },
    { id: 3, name: 'C', _id: 3, color: 'blue' },
    { id: 4, name: 'D', _id: 4, color: 'purple' }
];

export const accountIndustryList = [
    { id: 1, name: 'Advertising', _id: 1 },
    { id: 2, name: 'Banks', _id: 2 },
    { id: 3, name: 'Business services', _id: 3 },
    { id: 4, name: 'Construction', _id: 4 },
    { id: 5, name: 'Consulting', _id: 5 },
    { id: 6, name: 'Insurance', _id: 6 },
    { id: 7, name: 'IT companies', _id: 7 },
    { id: 8, name: 'Manufacturing and distribution', _id: 8 }
];