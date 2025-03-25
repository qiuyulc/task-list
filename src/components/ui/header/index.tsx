import styles from "./index.module.less";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.svg";
interface IHeaderProps {
  children?: JSX.Element;
}
const HeaderCom = (props: IHeaderProps) => {
  const navigate = useNavigate();
  const { children } = props;
  const [toolshow, setToolshow] = useState(true);

  return (
    <header className={styles.header}>
      <div
        className={styles.logo}
        onClick={() => {
          navigate("/home");
        }}
      >
        <img src={logo} alt="my week" />
      </div>
      <div className={styles.nav_tab}>{children}</div>
      <div
        className={styles.user_user_tool}
        style={{ width: toolshow ? `calc(${2.88 * 2}rem + ${20}px)` : 0 }}
      >
        <div
          className={styles.history}
          onClick={() => {
            navigate("/history");
          }}
          title={"历史记录"}
        ></div>
        <div
          className={styles.version}
          onClick={() => {
            navigate("/version");
          }}
          title={"版本记录"}
        ></div>
      </div>
      <div
        className={styles.user_info}
        onClick={() => setToolshow(!toolshow)}
      ></div>
    </header>
  );
};

export default HeaderCom;
