import { createSlice } from "@reduxjs/toolkit";

interface IScannerSlice {
    pageInfo: {
        pageNo: number;
        pageName: string;
    } | null;
}

const initialState: IScannerSlice = {
    pageInfo: null
}

const scannerSlice = createSlice({
    name: 'scanner',
    initialState,
    reducers: {
        setPageInfo: (state, action) => {
            state.pageInfo = action.payload;
        }
    }
})

export default scannerSlice.reducer;
export const { setPageInfo } = scannerSlice.actions;