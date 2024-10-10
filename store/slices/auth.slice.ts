import { createSlice } from "@reduxjs/toolkit";

interface IAuthSlice {
    user: {
        email: string;
        first_name: string;
        last_name: string;
        tier: number;
    }
}

const user = typeof window !== 'undefined' && localStorage.getItem('user') ;

const initialState: IAuthSlice = {
    user: user ? JSON.parse(user) : {
        email: '',
        first_name: '',
        last_name: '',
        tier: 0
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.user = action.payload;
        }
    }
})

export default authSlice.reducer;
export const { setUserData } = authSlice.actions;