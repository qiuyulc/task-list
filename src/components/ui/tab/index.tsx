import styles from "./index.module.less";
import { useState, useEffect, useRef } from "react";

export interface TabDataProps {
  title: string;
  id: number | string;
}

export interface TabProps {
  data: TabDataProps[];
  activeId?: TabDataProps["id"];
  onChange?: (id: TabDataProps["id"]) => void;
}
export function Tab(props: TabProps) {
  const { data, activeId, onChange } = props;
  const tab = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(activeId || data[0]?.id || 0);
  const [beforeStyle, setBeforeStyle] = useState({
    width: 0,
    height: 0,
    x: 0,
  });
  const onChangeTab = (id: TabDataProps["id"]) => {
    setActiveTab(id);
    onChange?.(id);
  };

  //处理tab切换时，背景跟随
  useEffect(() => {
    const activeTabItem = document.querySelector(`[data-id="${activeTab}"]`);
    const tabBox = (tab.current as HTMLDivElement).getBoundingClientRect();
    if (activeTabItem) {
      const { width, height, x } = activeTabItem.getBoundingClientRect();
      setBeforeStyle({ width, height, x: x - tabBox.x });
    }
  }, [activeTab]);

  return (
    <div className={styles.tab} ref={tab}>
      <span
        className={styles.before}
        style={{
          width: beforeStyle.width,
          height: beforeStyle.height,
          left: beforeStyle.x,
        }}
      />
      {data.map((item) => {
        return (
          <div
            key={item.id}
            data-id={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`${styles.tabItem} ${
              activeTab === item.id ? styles.active : ""
            }`}
          >
            {item.title}
          </div>
        );
      })}
    </div>
  );
}
