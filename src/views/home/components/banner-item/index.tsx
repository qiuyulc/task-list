import styles from "./index.module.less";
import { useMemo, useRef, memo, ReactNode,CSSProperties } from "react";
import { WeekTimeProps } from "@/redux/store/store-reducer";
import { SvgCircle } from "@/components/ui";
import SearchInput from "../input";
import List from "../list";
import Empty from "../empty";
const BannerItem = memo(function BannerItem(
  props: WeekTimeProps & { parentId: string; children?: ReactNode;style?:CSSProperties }
) {
  const {
    date,
    total,
    completed,
    id,
    list = [],
    week_str,
    parentId,
    style={},
    children,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const handleDate = useMemo(() => {
    const dateStr = date.split("/");
    return `${dateStr[1]}月${dateStr[2]}日`;
  }, [date]);

  const weekStr = useMemo(() => {
    return "周" + week_str;
  }, [week_str]);
  const handlePercent = useMemo(() => {
    const percent = completed / total;
    if (isNaN(percent)) return 0;
    return percent * 100;
  }, [total, completed]);

  const Text = () => {
    return (
      <p style={{ fontSize: "0.88rem", color: "rgba(153, 153, 153, 1)" }}>
        今天没有任务，
        <span
          style={{ color: "rgba(51, 51, 51, 1)", cursor: "pointer" }}
          onClick={() => {
            console.log(inputRef);
            inputRef.current?.focus();
          }}
        >
          添加任务
        </span>
        或放松一下吧~
      </p>
    );
  };

  return (
    <div className={styles.banner_item} style={{...style}}>
      <div className={styles.banner_item_top}>
        <div className={styles.banner_item_top_left}>
          <h3>
            周{props.week_str} {`（${props.completed}/${props.total}）`}
            {props.hot ? <span className={styles.after}>今天</span> : ""}
          </h3>
          <span className={styles.date}>{handleDate}</span>
        </div>
        <div ref={ref} className={styles.banner_item_top_right}>
          <SvgCircle percent={handlePercent} />
        </div>
      </div>

      {children ? (
        children
      ) : (
        <>
          <SearchInput ref={inputRef} id={id} />

          {list.length === 0 ? (
            <Empty text={<Text />} weekStr={week_str} />
          ) : (
            <List
              parentId={parentId}
              list={list}
              weekStr={weekStr}
              dateStr={handleDate}
            />
          )}
        </>
      )}
    </div>
  );
});

export default BannerItem;
