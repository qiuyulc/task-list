import styles from "./index.module.less";
import { useAppDispatch } from "@/redux/hook";
import {
  // addWeekTimeList,
  asyncAddWeekTimeList,
} from "@/redux/store/store-reducer";
import { forwardRef, useImperativeHandle, useRef } from "react";
const SearchInput = forwardRef((props: { id: string }, ref) => {
  const dispatch = useAppDispatch();
  const { id } = props;
  const input = useRef(null);
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value;
      const date = new Date().getTime();
      dispatch(asyncAddWeekTimeList({ parentId: id, title: value, date }));
      (e.target as HTMLInputElement).value = "";
    }
  };
  useImperativeHandle(
    ref,
    () => {
      return input.current;
    },
    [input]
  );
  return (
    <div className={styles.search_input}>
      <span className={styles.search_icon}>
        <i className={styles.icon}></i>
      </span>
      <input
        ref={input}
        type="text"
        onKeyDown={onKeyDown}
        placeholder="输入任务名称，按“回车键”即可添加"
      />
      <span className={`${styles.after_icon}`}>
        <i className={styles.icon_after_icon}></i>
      </span>
    </div>
  );
});

export default SearchInput;
