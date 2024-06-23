import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/slices/auth.slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
        auth: authReducer
    },
  })
}

export type AppStoreType = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStoreType['getState']>
export type AppDispatch = AppStoreType['dispatch']