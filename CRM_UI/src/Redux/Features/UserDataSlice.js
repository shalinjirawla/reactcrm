import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: '',
    permissions: [],
    currentUser: null,
    currentUserData: null,
    currentUserRole: null,
    tenantData: null,
    contactData: null,
    accountData: null,
    profileData: null
}

export const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserIdData: (state, action) => {
            state.userId = action.payload;
        },
        setPermissionData: (state, action) => {
            state.permissions = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setCurrentUserData: (state, action) => {
            state.currentUserData = action.payload;
        },
        setCurrentUserRole: (state, action) => {
            state.currentUserRole = action.payload;
        },
        setTenantData: (state, action) => {
            state.tenantData = action.payload;
        },
        setContactData: (state, action) => {
            state.contactData = action.payload;
        },
        setAccountData: (state, action) => {
            state.accountData = action.payload;
        },
        setProfileData: (state, action) => {
            state.profileData = action.payload;
        }
    },
});

export const { setUserIdData, setPermissionData, setCurrentUser, setCurrentUserData, setCurrentUserRole, setTenantData, setContactData, setAccountData, setProfileData } = userDataSlice.actions;

export default userDataSlice.reducer;