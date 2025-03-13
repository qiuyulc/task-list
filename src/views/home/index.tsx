import { useState } from "react";
import styles from "./index.module.less";
import { Tab } from "@/components/ui";
// import LayoutFooter from "@/components/layout-footer";
import type { TabProps, TabDataProps } from "@/components/ui/tab";
import SwiperBanner from "./components/banner";
import logo from "@/assets/images/logo.svg";
function Home() {
  const [tabList] = useState<TabProps["data"]>([
    { title: "天", id: 1 },
    { title: "周", id: 2 },
  ]);
  const [activeId, setActiveId] = useState<number>(1);
  const handleTabChange = (id: TabDataProps["id"]) => {
    setActiveId(id as number);
  };

//   useEffect(()=>{
//     console.log(activeId,'activeId')
//   },[activeId])
  return (
    <main className={styles.home}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="my week" />
        </div>
        <div className={styles.nav_tab}>
          <Tab data={tabList} onChange={handleTabChange} />
        </div>
        <div className={styles.user_info}></div>
      </header>

      <section className={styles.home_main}>
        <SwiperBanner tab_key={activeId} />
      </section>
      {/* <LayoutFooter /> */}
    </main>
  );
}

export default Home;
