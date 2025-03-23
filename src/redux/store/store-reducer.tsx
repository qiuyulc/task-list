import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getWeekTime, findDifferentItems } from "@/utils/utils";
import { RootState } from "../store";
import IndexedDB from "../IndexedDB";
import { UUID } from "uuidjs";
export interface WeekList {
  id: string;
  title: string;
  status: boolean;
  text?: string;
  date: number;
  parentId: string;
}

export interface WeekListProps {
  [key: string]: WeekList[];
}

export interface WeekTimeProps {
  hot?: boolean;
  date: string;
  week_str: string;
  list?: WeekList[];
  id: string;
  total: number;
  completed: number;
}

interface InitResponse {
  weekTime: WeekTimeProps[];
  weekTimeList: WeekListProps;
}
const initialState: {
  swiperIndex: number;
  weekTime: WeekTimeProps[];
  weekTimeList: WeekListProps;
} = {
  swiperIndex: -1,
  weekTime: [],
  weekTimeList: {},
};

const indexedDB = new IndexedDB({
  dbName: "myweek",
  stores: [
    { storeName: "weekTime", keyPath: "date" },
    { storeName: "weekTimeList", keyPath: "id" },
  ],
});

const week = ["一", "二", "三", "四", "五", "六", "天"];
export const storeReducer = createSlice({
  name: "store_reducer",
  initialState,
  reducers: {
    //处理单个排序问题
    editWeekTimeList(state, action) {
      const { parentId, data } = action.payload;
      state.weekTimeList[parentId] = data;
    },
    removeItem(state, action) {
      const { id, parentId, status } = action.payload;
      const children = state.weekTimeList[parentId];
      state.weekTimeList[parentId] = children.filter(
        (item) => !(item.id === id)
      );
      const hotDay = state.weekTime.find((item) => item.id === parentId);
      if (hotDay) {
        if (status) {
          hotDay.completed--;
        }
        hotDay.total--;
      }
    },
    editText(state, action) {
      const { id, text, parentId } = action.payload;
      const children = state.weekTimeList[parentId];
      for (let i = 0; i < children.length; i++) {
        if (children[i].id === id) {
          children[i].text = text;
          break;
        }
      }
      state.weekTimeList[parentId] = children;
    },
    editHot(state, action) {
      const { id, status, parentId } = action.payload;
      const children = state.weekTimeList[parentId];
      const hotDay = state.weekTime.find((item) => item.id === parentId);

      state.weekTime = [...state.weekTime];
      for (let i = 0; i < children.length; i++) {
        if (children[i].id === id) {
          children[i].status = status;
          if (hotDay) {
            if (status) {
              hotDay.completed++;
            } else {
              hotDay.completed--;
            }
          }
          break;
        }
      }
      state.weekTimeList[parentId] = children;
    },
    setSwiperIndex(state, action) {
      state.swiperIndex = action.payload;
    },
    addWeekTimeList(state, action) {
      const { title, date, parentId } = action.payload;
      const hotDay = state.weekTime.find((item) => item.id === parentId);
      if (hotDay) {
        hotDay.total++;
      }
      state.weekTime = [...state.weekTime];
      state.weekTimeList[parentId] = [
        {
          id: UUID.generate(),
          title,
          date,
          status: false,
          parentId,
        },
        ...(state.weekTimeList[parentId] || []),
      ];
    },
    initWeekList(state) {
      const hotday = new Date().toLocaleDateString();
      const weekListArr = getWeekTime();
      const list: WeekListProps = {};
      const weekTime = weekListArr.map((item, i) => {
        const id: string = UUID.generate();
        if (item === hotday) {
          state.swiperIndex = i;
        }
        list[id] = [];
        return {
          date: item,
          week_str: week[i],
          hot: item === hotday,
          id: id,
          total: 0,
          completed: 0,
        };
      });
      state.weekTime = weekTime;
      state.weekTimeList = list;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      init.fulfilled,
      (state, action: PayloadAction<InitResponse>) => {
        const { weekTime, weekTimeList } = action.payload;
        if (weekTime.length > 0) {
          const hotday = new Date().toLocaleDateString();
          state.weekTime = weekTime.map((u) => {
            return { ...u, hot: u.date === hotday };
          });
          const resultIndex = state.weekTime.findIndex((item) => item.hot);
          if (resultIndex !== -1) {
            state.swiperIndex = resultIndex;
          }
          state.weekTimeList = weekTimeList;
        }
      }
    );
  },
});

export const init = createAsyncThunk<InitResponse>(
  "store_reducer/initWeekList",
  async (_, thunkAPI) => {
    try {
      const weekListArr = getWeekTime();
      const result = await indexedDB.getItem<WeekTimeProps>(
        weekListArr,
        "weekTime"
      );
      const listResult: WeekListProps = {};
      if (result.length > 0) {
        const listResultData = await indexedDB.getItem<{
          id: string;
          data: WeekList[];
        }>([...result.map((item) => item.id)], "weekTimeList");
        listResultData.forEach((item: { id: string; data: WeekList[] }) => {
          listResult[item.id] = item.data;
        });
      }
      if (result.length === 0) {
        thunkAPI.dispatch(initWeekList());
        const state = thunkAPI.getState() as RootState;
        const weekTime = state.storeReducer.weekTime.map((u) => {
          return {
            ...u,
            hot: false,
          };
        });
        indexedDB.addItem(weekTime, "weekTime");
        return { weekTime: [], weekTimeList: {} };
      } else if (result.length !== 7) {
        //表示有数据但是数据有缺失
        //找出确实的日期
        const time = findDifferentItems(
          weekListArr,
          result.map((item) => item.date)
        );
        const timeArr = time.map((item) => {
          return {
            date: item,
            week_str: week[new Date(item).getDay() - 1],
            hot: false,
            id: UUID.generate(),
            total: 0,
            completed: 0,
          };
        });
        const add = await indexedDB.addItem(timeArr, "weekTime");
        if (add) {
          const weekTime = [...result, ...timeArr].sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          return {
            weekTime: weekTime,
            weekTimeList: listResult,
          };
        }
      } else {
        return {
          weekTime: result,
          weekTimeList: listResult,
        };
      }
    } catch (error) {
      console.log(error);
    }
    return {
      weekTime: [],
      weekTimeList: {},
    };
  }
);

export const asyncAddWeekTimeList = createAsyncThunk(
  "store_reducer/addWeekTimeList",
  async (
    options: { parentId: string; title: string; date: number },
    thunkAPI
  ) => {
    const { parentId } = options;
    thunkAPI.dispatch(addWeekTimeList(options));
    const state = thunkAPI.getState() as RootState;
    const { weekTimeList, weekTime } = state.storeReducer;
    const weekTimeItem = weekTime.find((item) => item.id === parentId);
    const weekTimeListItem = weekTimeList[parentId];
    indexedDB.editItem([weekTimeItem], "weekTime");
    indexedDB.editItem(
      [{ id: parentId, data: weekTimeListItem }],
      "weekTimeList"
    );
  }
);

export const asyncRemoveItem = createAsyncThunk(
  "store_reducer/removeItem",
  async (
    options: { id: string; parentId: string; status: boolean },
    thunkAPI
  ) => {
    const { parentId } = options;
    thunkAPI.dispatch(removeItem(options));
    const state = thunkAPI.getState() as RootState;
    const { storeReducer } = state;
    const { weekTime, weekTimeList } = storeReducer;
    const weekTimeItem = weekTime.find((item) => item.id === parentId);
    const weekTimeListItem = weekTimeList[parentId];
    indexedDB.editItem([weekTimeItem], "weekTime");
    indexedDB.editItem(
      [{ id: parentId, data: weekTimeListItem }],
      "weekTimeList"
    );
  }
);

export const asyncEditText = createAsyncThunk(
  "store_reducer/editText",
  async (options: { parentId: string; id: string; text: string }, thunkAPI) => {
    const { parentId } = options;
    thunkAPI.dispatch(editText(options));
    const state = thunkAPI.getState() as RootState;
    const { storeReducer } = state;
    const { weekTime, weekTimeList } = storeReducer;
    const weekTimeItem = weekTime.find((item) => item.id === parentId);
    const weekTimeListItem = weekTimeList[parentId];
    indexedDB.editItem([weekTimeItem], "weekTime");
    indexedDB.editItem(
      [{ id: parentId, data: weekTimeListItem }],
      "weekTimeList"
    );
  }
);

//修改
export const asyncEditHot = createAsyncThunk(
  "store_reducer/editHot",
  async (
    options: { parentId: string; status: boolean; id: string },
    thunkAPI
  ) => {
    const { parentId } = options;
    thunkAPI.dispatch(editHot(options));
    const state = thunkAPI.getState() as RootState;
    const { storeReducer } = state;
    const { weekTime, weekTimeList } = storeReducer;
    const weekTimeItem = weekTime.find((item) => item.id === parentId);
    const weekTimeListItem = weekTimeList[parentId];
    indexedDB.editItem([weekTimeItem], "weekTime");
    indexedDB.editItem(
      [{ id: parentId, data: weekTimeListItem }],
      "weekTimeList"
    );
  }
);

//修改排序
export const asyncEditWeekTimeList = createAsyncThunk(
  "store_reducer/editWeekTimeList",
  async (options: { parentId: string; data: WeekList[] }, thunkAPI) => {
    thunkAPI.dispatch(editWeekTimeList(options));
    indexedDB.editItem(
      [{ id: options.parentId, data: options.data }],
      "weekTimeList"
    );
  }
);

export const {
  initWeekList,
  setSwiperIndex,
  addWeekTimeList,
  editHot,
  editText,
  removeItem,
  editWeekTimeList,
} = storeReducer.actions;
export default storeReducer.reducer;
