import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IndexedDB from "../IndexedDB";
import { WeekTimeProps, weekTimeListItemProps } from "./store-reducer";
const indexedDB = new IndexedDB({
  dbName: "myweek",
  stores: [
    { storeName: "weekTime", keyPath: "date" },
    { storeName: "weekTimeList", keyPath: "id" },
  ],
});

interface HistoryState {
  history_list: {
    [key: string]: WeekTimeProps[];
  };
}

const initialState: HistoryState = {
  history_list: {},
};
export const historySlice = createSlice({
  name: "history_list",
  initialState: initialState,
  reducers: {
    setData(state, action) {
      const { date, data } = action.payload;
      state.history_list[date] = data;
    },
  },
  //   extraReducers: (build) => {},
});

export const initializeHistory = createAsyncThunk(
  "history_list/initializeHistory",
  async (options: { start: string; end: string; date: string }, thunkAPI) => {
    const { start, end } = options;
    const result: WeekTimeProps[] = await indexedDB.getAll(
      [start, end],
      "weekTime"
    );

    if (result.length > 0) {
      const list: weekTimeListItemProps[] =
        await indexedDB.getItem<weekTimeListItemProps>(
          [...result.map((item) => item.id)],
          "weekTimeList"
        );
      for (let i = 0; i < result.length; i++) {
        const id = result[i].id;
        const children = list.find((item) => item.id === id);
        if (children) {
          result[i].list = children.data;
        }
      }
      thunkAPI.dispatch(setData({ date: options.date, data: result }));
    }
  }
);

export const { setData } = historySlice.actions;
export default historySlice.reducer;
