import {configureStore } from '@reduxjs/toolkit'
import storeReducer from './store/store-reducer'
import historyListReducer from './store/history-reducer';
const store = configureStore({
    reducer:{
        storeReducer,
        historyListReducer,
    }
})

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;


export default store