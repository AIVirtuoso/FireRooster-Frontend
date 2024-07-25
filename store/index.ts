import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/slices/auth.slice'
import scannerReducer from '@/store/slices/scanner.slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
        auth: authReducer,
        scanner: scannerReducer
    },
  })
}

export type AppStoreType = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStoreType['getState']>
export type AppDispatch = AppStoreType['dispatch']