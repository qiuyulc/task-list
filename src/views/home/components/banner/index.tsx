import BannerItem from "../banner-item";
import { useEffect, useMemo, useState, useRef } from "react";
import type { CSSProperties } from "react";
import styles from "./index.module.less";

import {
  // initWeekList,
  setSwiperIndex,
  init,
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

  return (
    <div className={styles.swiper_banner}>
      <div className={styles.swiper} ref={swiperRef} style={{ ...swiperStyle }}>
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
                  <BannerItem {...item} list={weekTimeList[item.id]} />
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
}
