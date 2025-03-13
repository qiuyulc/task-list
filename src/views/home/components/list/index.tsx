import styles from "./index.module.less";
import ListItem from "./list-item";
import { WeekList } from "@/redux/store/store-reducer";

function List(props: { list: WeekList[]; weekStr: string; dateStr: string }) {
  const { list = [], weekStr, dateStr } = props;

  return (
    <div className={styles.list}>
      {list.map((item) => {
        return (
          <div key={item.id}>
            <ListItem
              date={item.date}
              text={item?.text}
              status={item.status}
              title={item.title}
              id={item.id}
              parentId={item.parentId}
              weekStr={weekStr}
              dateStr={dateStr}
            />
          </div>
        );
      })}
    </div>
  );
}

export default List;
