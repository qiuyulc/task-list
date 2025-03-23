import styles from "./index.module.less";
import ListItem from "./list-item";
import { WeekList } from "@/redux/store/store-reducer";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

interface Item {
  id: string;
  children: React.ReactNode;
}
const SortableItem = ({ id, children }: Item) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="list-item"
    >
      {children}
    </div>
  );
};
function List(props: {
  list: WeekList[];
  weekStr: string;
  dateStr: string;
  parentId: string;
}) {
  const { list = [], weekStr, dateStr, parentId } = props;

  return (
    <div className={styles.list}>
      <SortableContext
        items={list}
        id={parentId}
        strategy={verticalListSortingStrategy}
      >
        {list.map((item) => {
          return (
            <SortableItem key={item.id} id={item.id}>
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
            </SortableItem>
          );
        })}
      </SortableContext>
    </div>
  );
}

export default List;
