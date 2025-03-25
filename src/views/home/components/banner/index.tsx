import BannerItem from "../banner-item";
import { useEffect, useMemo, useState, useRef } from "react";
import type { CSSProperties } from "react";
import styles from "./index.module.less";
import { TitleCom } from "../list/list-item";
import {
  DragOverlay,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  // DragOverEvent,
} from "@dnd-kit/core";

import {
  // initWeekList,
  setSwiperIndex,
  init,
  asyncEditWeekTimeList,
} from "@/redux/store/store-reducer";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

interface SwiperBannerProps {
  tab_key: number; //获取当前选中的tab
}

const WIDTH = 26.25;
const MARGIN_LEFT = 2.5;
export default function SwiperBanner(props: SwiperBannerProps) {
  const { tab_key } = props;
  const dispatch = useAppDispatch();

  const { swiperIndex, weekTime, weekTimeList } = useAppSelector(
    (state) => state.storeReducer
  );
  const [swiperStyle, setSwiperStyle] = useState<CSSProperties>({
    width: "100%",
    display: "flex",
    justifyContent: "center",
  });
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(init());
  }, [dispatch]);

  //生成基础数据
  // useEffect(() => {
  //   if (weekTime.length === 0) {
  //     dispatch(initWeekList());
  //   }
  // }, [weekTime, dispatch]);

  //计算数据列表
  const swiperList = useMemo(() => {
    if (tab_key === 1) {
      const weekItem = weekTime.filter((item) => item.hot);
      return weekItem;
    } else {
      const data = [...weekTime];
      return data;
    }
  }, [tab_key, weekTime]);

  //实现轮播
  useEffect(() => {
    // console.log(swiperStyle);
    if (tab_key === 1) {
      setSwiperStyle({
        width: "100%",
        display: "flex",
        justifyContent: "center",
      });
    } else {
      let translateX = WIDTH / 2 - MARGIN_LEFT;
      translateX = -(swiperIndex - 2) * (WIDTH + MARGIN_LEFT) - translateX;
      // oldIndex.current = swiperIndex;
      setSwiperStyle({
        transform: `translateX(${translateX}rem)`,
      });
    }
  }, [tab_key, swiperIndex, swiperList]);
  const [activeId, setActiveId] = useState<{ id: string; parentId: string }>({
    id: "",
    parentId: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 需要移动8px才触发拖拽
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    // console.log(event, "event");
    const { data, id } = event.active;
    const { current = {} } = data;

    setActiveId({
      id: id as string,
      parentId: current.sortable.containerId,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      console.log(active, over);
      const { data: activeData } = active;
      const { current: activeCurrent = {} } = activeData;
      const parentId = activeCurrent.sortable.containerId;
      const { data: overData } = over;
      const { current: overCurrent = {} } = overData;
      const overParentId = overCurrent.sortable.containerId;
      if (parentId === overParentId) {
        //表示两者是同一个父级关系,只需要重新排序就可以了
        const list = weekTimeList[parentId];
        const activeIndex = list.findIndex((item) => item.id === active.id);
        const overIndex = list.findIndex((item) => item.id === over.id);
        const newList = [...list];
        newList.splice(activeIndex, 1);
        newList.splice(overIndex, 0, list[activeIndex]);
        dispatch(
          asyncEditWeekTimeList({
            parentId,
            data: [...newList],
          })
        );
      }
    }
    setActiveId({ id: "", parentId: "" });
  };

  // const handleOver = (event: DragOverEvent) => {
  //   console.log(event);
  //   const { data, id } = event.active;
  //   const { current = {} } = data;

  //   setActiveId({
  //     id: id as string,
  //     parentId: current.sortable.containerId,
  //   });
  // };

  const item = weekTimeList[activeId.parentId];
  const activeItem = item && item.find((item) => item.id === activeId.id);
  console.log(activeItem, "activeItem");

  return (
    <div className={styles.swiper_banner}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        // onDragOver={handleOver}
      >
        <div
          className={styles.swiper}
          ref={swiperRef}
          style={{ ...swiperStyle }}
        >
          {swiperList.length !== 0
            ? swiperList.map((item, index) => {
                return (
                  <div
                    className={styles.swiper_item}
                    data-index={index}
                    key={item.id + "_" + index}
                    style={{
                      transform:
                        index === swiperIndex && tab_key != 1
                          ? `translateY(-10px)`
                          : "none",
                      transition: "transform 1s",
                    }}
                    onClick={() => {
                      if (tab_key !== 1) {
                        dispatch(setSwiperIndex(index));
                      }
                    }}
                  >
                    <BannerItem
                      {...item}
                      parentId={item.id}
                      list={weekTimeList[item.id]}
                    />
                  </div>
                );
              })
            : ""}
        </div>
        <DragOverlay>
          {activeItem && (
            <div
              style={{
                display: "flex",
                height: " 2.88rem",
                padding: "0 1rem",
                lineHeight: "2.88rem",
                border: "1px solid var(--banner-top-title-border-color)",
              }}
            >
              <TitleCom status={false} title={activeItem?.title} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
