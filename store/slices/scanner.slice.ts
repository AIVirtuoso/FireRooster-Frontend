import { createSlice } from "@reduxjs/toolkit";

interface IScannerSlice {
    currentPage: string | null;
}

const initialState: IScannerSlice = {
    currentPage: null
}

const scannerSlice = createSlice({
    name: 'scanner',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    }
})

export default scannerSlice.reducer;
export const { setCurrentPage } = scannerSlice.actions;