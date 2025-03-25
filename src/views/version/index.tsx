import styles from "./index.module.less";
import HeaderCom from "@/components/ui/header";
const Version = () => {
  const data = [
    {
      title: "v1.0.2",
      date: "2025-03-25",
      desc: "增加历史记录，增加版本时间线",
    },
    {
      title: "v1.0.1",
      date: "2025-03-23",
      desc: "增加任务列表排序",
    },
    {
      title: "v1.0.0",
      date: "2025-03-10",
      desc: "项目v1.0.0",
    },
  ];

  return (
    <div className={styles.version}>
      <HeaderCom>
        <h2>更新记录</h2>
      </HeaderCom>
      <div className={styles.version_box}>
        <ul className={styles.timeline}>
          {data.map((item) => {
            return (
              <li key={item.date} className={styles.timeline_item}>
                <span className={styles.date}>{item.date}</span>
                <div className={styles.content}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.desc}>{item.desc}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Version;
