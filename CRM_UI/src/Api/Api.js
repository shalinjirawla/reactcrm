import axios from "axios";
import { API_HOST } from "../Constants";

const baseUrl = `${API_HOST}/api`;

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');
        if (token) {
            config.headers = {
                token: token,
            }
        }
        return config;
    },
    (error) => {
        if (error.response && error.response.status === 400) {
            return axiosInstance.request(error.config);
        }
        return error.response ? error.response : Promise.reject(new Error(error));
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error?.response?.status === 400 || error?.response?.status === 403 || error?.response?.status === 404 || error?.response?.status === 409 || error?.response?.status === 500) { }
        if (error?.response?.data?.isAuth === false) {
            localStorage.clear();
        }
        return error.response ? error.response : Promise.reject(new Error(error));
    }
);


// --------------------------------- Tenant-Registration ---------------------------------

export const tenantRegistration = async (data) => {
    return await axiosInstance.post(`${baseUrl}/TenantRegister/RegisterTenant`, data);
};

export const getVerifyTenant = async (id) => {
    return await axiosInstance.post(`${baseUrl}/TenantRegister/VerifyEmail?id=${id}`);
};

// --------------------------------- Login ---------------------------------

export const getUserLogin = async (data) => {
    return await axiosInstance.post(`${baseUrl}/Login/CRMLogin`, data);
};


// --------------------------------- Roles ---------------------------------

export const addRole = async (data) => {
    return await axiosInstance.post(`${baseUrl}/Role/AddRole`, data);
};

export const getAllRole = async () => {
    return await axiosInstance.get(`${baseUrl}/Role/GetRoles`);
};

export const updateRole = async (data) => {
    return await axiosInstance.put(`${baseUrl}/Role/UpdateRole`, data);
};

export const deleteRole = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/Role/DeleteRole?id=${id}`);
};

export const getExportExcelFileByRole = async () => {
    return await axiosInstance.get(`${baseUrl}/Role/GetExportExcelByRole`);
};


// --------------------------------- Users ---------------------------------

export const addUser = async (data) => {
    return await axiosInstance.post(`${baseUrl}/User/AddUser`, data);
};

export const getAllUser = async () => {
    return await axiosInstance.get(`${baseUrl}/User/GetUsers`);
};

export const updateUser = async (data) => {
    return await axiosInstance.put(`${baseUrl}/User/UpdateUser`, data);
};

export const deleteUser = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/User/DeleteUser?id=${id}`);
};

export const getAllUserOfTenant = async (id) => {
    return await axiosInstance.get(`${baseUrl}/User/GetUsersByTenant?tenantId=${id}`);
};

export const getExportExcelFileByUser = async (tenantId) => {
    let subUrl = `${baseUrl}/User/GetExportExcelByUser`;

    if (tenantId) {
        subUrl += '?tenantId=' + tenantId;
    }

    return await axiosInstance.get(`${subUrl}`);
};


// --------------------------------- Tenants ---------------------------------

export const addTenant = async (data) => {
    return await axiosInstance.post(`${baseUrl}/Tenant/AddTenant`, data);
};

export const getAllTenant = async () => {
    return await axiosInstance.get(`${baseUrl}/Tenant/GetTenants`);
};

export const updateTenant = async (data) => {
    return await axiosInstance.put(`${baseUrl}/Tenant/UpdateTenant`, data);
};

export const deleteTenant = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/Tenant/DeleteTenant?id=${id}`);
};

export const getExportExcelFileByTenant = async () => {
    return await axiosInstance.get(`${baseUrl}/Tenant/GetExportExcelByTenant`);
};


// --------------------------------- Contacts ---------------------------------

export const addContact = async (data) => {
    return await axiosInstance.post(`${baseUrl}/Contact/AddContact`, data);
};

export const getAllContact = async () => {
    return await axiosInstance.get(`${baseUrl}/Contact/GetContacts`);
};

export const updateContact = async (data) => {
    return await axiosInstance.put(`${baseUrl}/Contact/UpdateContact`, data);
};

export const deleteContact = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/Contact/DeleteContact?id=${id}`);
};

export const getAllContactByTenant = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Contact/GetContactsByTenant?tenantId=${id}`);
};

export const getAllContactByTenantAdmin = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Contact/GetContactsByTenantAdmin?tenantId=${id}`);
};

export const getAllContactByUser = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Contact/GetContactsByUser?userId=${id}`);
};

export const getExportExcelFileByContact = async (tenantId, tenantAdminId, userId) => {
    let subUrl = `${baseUrl}/Contact/GetExportExcelByContact`;

    if (tenantId) {
        subUrl += '?tenantId=' + tenantId;
    }
    if (tenantAdminId) {
        subUrl += '?tenantAdminId=' + tenantAdminId;
    }
    if (userId) {
        subUrl += '?userId=' + userId;
    }

    return await axiosInstance.get(`${subUrl}`);
};


// --------------------------------- Leads ---------------------------------

export const addLead = async (data) => {
    return await axiosInstance.post(`${baseUrl}/Lead/AddLead`, data);
};

export const getAllLead = async () => {
    return await axiosInstance.get(`${baseUrl}/Lead/GetLeads`);
};

export const updateLead = async (data) => {
    return await axiosInstance.put(`${baseUrl}/Lead/UpdateLead`, data);
};

export const deleteLead = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/Lead/DeleteLead?id=${id}`);
};

export const getAllLeadByTenant = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Lead/GetLeadsByTenant?tenantId=${id}`);
};

export const getAllLeadByTenantAdmin = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Lead/GetLeadsByTenantAdmin?tenantId=${id}`);
};

export const getAllLeadByUser = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Lead/GetLeadsByUser?userId=${id}`);
};

export const getExportExcelFileByLead = async (tenantId, tenantAdminId, userId) => {
    let subUrl = `${baseUrl}/Lead/GetExportExcelByLead`;

    if (tenantId) {
        subUrl += '?tenantId=' + tenantId;
    }
    if (tenantAdminId) {
        subUrl += '?tenantAdminId=' + tenantAdminId;
    }
    if (userId) {
        subUrl += '?userId=' + userId;
    }

    return await axiosInstance.get(`${subUrl}`);
};


// --------------------------------- Opportunities ---------------------------------

export const addOpportunity = async (data) => {
    return await axiosInstance.post(`${baseUrl}/Opportunity/AddOpportunity`, data);
};

export const getAllOpportunity = async () => {
    return await axiosInstance.get(`${baseUrl}/Opportunity/GetOpportunities`);
};

export const updateOpportunity = async (data) => {
    return await axiosInstance.put(`${baseUrl}/Opportunity/UpdateOpportunity`, data);
};

export const deleteOpportunity = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/Opportunity/DeleteOpportunity?id=${id}`);
};

export const getAllOpportunityByTenant = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Opportunity/GetOpportunitiesByTenant?tenantId=${id}`);
};

export const getAllOpportunityByTenantAdmin = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Opportunity/GetOpportunitiesByTenantAdmin?tenantId=${id}`);
};

export const getAllOpportunityByUser = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Opportunity/GetOpportunitiesByUser?userId=${id}`);
};

export const getExportExcelFileByOpportunity = async (tenantId, tenantAdminId, userId) => {
    let subUrl = `${baseUrl}/Opportunity/GetExportExcelByOpportunity`;

    if (tenantId) {
        subUrl += '?tenantId=' + tenantId;
    }
    if (tenantAdminId) {
        subUrl += '?tenantAdminId=' + tenantAdminId;
    }
    if (userId) {
        subUrl += '?userId=' + userId;
    }

    return await axiosInstance.get(`${subUrl}`);
};


// --------------------------------- Accounts ---------------------------------

export const addAccount = async (data) => {
    return await axiosInstance.post(`${baseUrl}/Account/AddAccount`, data);
};

export const getAllAccount = async () => {
    return await axiosInstance.get(`${baseUrl}/Account/GetAccounts`);
};

export const updateAccount = async (data) => {
    return await axiosInstance.put(`${baseUrl}/Account/UpdateAccount`, data);
};

export const deleteAccount = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/Account/DeleteAccount?id=${id}`);
};

export const getAllAccountByTenant = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Account/GetAccountsByTenant?tenantId=${id}`);
};

export const getAllAccountByTenantAdmin = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Account/GetAccountsByTenantAdmin?tenantId=${id}`);
};

export const getAllAccountByUser = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Account/GetAccountsByUser?userId=${id}`);
};

export const getExportExcelFileByAccount = async (tenantId, tenantAdminId, userId) => {
    let subUrl = `${baseUrl}/Account/GetExportExcelByAccount`;

    if (tenantId) {
        subUrl += '?tenantId=' + tenantId;
    }
    if (tenantAdminId) {
        subUrl += '?tenantAdminId=' + tenantAdminId;
    }
    if (userId) {
        subUrl += '?userId=' + userId;
    }

    return await axiosInstance.get(`${subUrl}`);
};


// --------------------------------- Tasks ---------------------------------

export const addTask = async (data) => {
    return await axiosInstance.post(`${baseUrl}/Task/AddTask`, data);
};

export const getAllTask = async () => {
    return await axiosInstance.get(`${baseUrl}/Task/GetTasks`);
};

export const updateTask = async (data) => {
    return await axiosInstance.put(`${baseUrl}/Task/UpdateTask`, data);
};

export const deleteTask = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/Task/DeleteTask?id=${id}`);
};

export const getAllTaskByTenant = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Task/GetTasksByTenant?tenantId=${id}`);
};

export const getAllTaskByTenantAdmin = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Task/GetTasksByTenantAdmin?tenantId=${id}`);
};

export const getAllTaskByUser = async (id) => {
    return await axiosInstance.get(`${baseUrl}/Task/GetTasksByUser?userId=${id}`);
};

export const getExportExcelFileByTask = async (tenantId, tenantAdminId, userId) => {
    let subUrl = `${baseUrl}/Task/GetExportExcelByTask`;

    if (tenantId) {
        subUrl += '?tenantId=' + tenantId;
    }
    if (tenantAdminId) {
        subUrl += '?tenantAdminId=' + tenantAdminId;
    }
    if (userId) {
        subUrl += '?userId=' + userId;
    }

    return await axiosInstance.get(`${subUrl}`);
};


// --------------------------------- Import-Excel ---------------------------------

export const importExcelData = async (formData) => {
    return await axiosInstance.post(`${baseUrl}/ImportExcel/ImportExcelData`, formData);
};

export const getSampleData = async (module) => {
    return await axiosInstance.get(`${baseUrl}/ImportExcel/GetSampleData?Module=${module}`);
};