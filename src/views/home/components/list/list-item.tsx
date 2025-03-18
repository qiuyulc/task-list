import { useRef, useMemo, useState, memo } from "react";
import styles from "./index.module.less";
import {
  WeekList,
  // editHot,
  // editText,
  // removeItem,
  asyncEditText,
  asyncRemoveItem,
  asyncEditHot,
} from "@/redux/store/store-reducer";
import handleIcon from "@/assets/images/handle.svg";
import Modal from "@/components/ui/modal";
import { useAppDispatch } from "@/redux/hook";
import MyEditor from "@/components/ui/editor";
import type { refProps } from "@/components/ui/editor";

const { confirm } = Modal;
// 定义一个Footer组件，接收一个props参数，包含onSave和onRemove两个函数
const Footer = (props: { onSave: () => void; onRemove: () => void }) => {
  // 解构props参数，获取onSave和onRemove函数
  const { onSave, onRemove } = props;
  // 返回一个div元素，包含两个子元素，分别是删除和保存按钮
  return (
    <div className={styles.modal_footer}>
      <div className={styles.modal_footer_remove} onClick={onRemove}>
        删除
      </div>
      <div className={styles.modal_footer_edit} onClick={onSave}>
        保存
      </div>
    </div>
  );
};

const Title = memo(
  ({ weekStr, dateStr }: { weekStr: string; dateStr: string }) => {
    return (
      <div className={styles.title_header}>
        <span className={styles.week}>{weekStr}</span>
        <span className={styles.date}>{dateStr}</span>
      </div>
    );
  }
);
function ListItem(props: WeekList & { weekStr: string; dateStr: string }) {
  const { status, title, id, parentId, text = "", weekStr, dateStr } = props;
  const dispatch = useAppDispatch();
  const editor = useRef<refProps>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const hotSvg = useMemo(() => {
    return status ? (
      <svg
        width="1rem"
        height="1rem"
        viewBox="0 0 16 16"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g
            transform="translate(-330.000000, -558.000000)"
            fill="#E2E2E2"
            fillRule="nonzero"
          >
            <g transform="translate(290.000000, 200.000000)">
              <g transform="translate(24.000000, 343.000000)">
                <g transform="translate(16.000000, 12.000000)">
                  <path
                    className={styles.complete}
                    d="M8,3 C3.58214286,3 0,6.58214286 0,11 C0,15.4178571 3.58214286,19 8,19 C12.4178571,19 16,15.4178571 16,11 C16,6.58214286 12.4178571,3 8,3 Z M11.4553571,8.3875 L7.69464286,13.6017857 C7.46785714,13.9178571 6.99821429,13.9178571 6.77142857,13.6017857 L4.54464286,10.5160714 C4.47678571,10.4214286 4.54464286,10.2892857 4.66071429,10.2892857 L5.49821429,10.2892857 C5.68035714,10.2892857 5.85357143,10.3767857 5.96071429,10.5267857 L7.23214286,12.2910714 L10.0392857,8.39821429 C10.1464286,8.25 10.3178571,8.16071429 10.5017857,8.16071429 L11.3392857,8.16071429 C11.4553571,8.16071429 11.5232143,8.29285714 11.4553571,8.3875 Z"
                  ></path>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    ) : (
      <svg width="1rem" height="1rem" viewBox="0 0 100 100">
        <path
          d="M50 8
       a 42 42 0 0 1 0 84
       a 42 42 0 0 1 0 -84"
          fill="#fff"
          className={styles.svg_path}
          onAnimationEnd={() => {
            console.log("执行结束");
          }}
          strokeWidth="8"
          strokeDasharray="263.89"
          strokeDashoffset="263.89"
        ></path>
      </svg>
    );
  }, [status]);

  const handleEdit = (event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    setModalOpen(true);
  };

  const handleRemove = () => {
    confirm({
      title: "你确定要删除这条记录吗？",
      onClose: () => {},
      onOk: () => {
        dispatch(asyncRemoveItem({ parentId, id, status }));
      },
    });
    //
  };

  const handleGetHtml = () => {
    if (editor) {
      const html = editor.current?.getHtml() as string;
      dispatch(asyncEditText({ parentId, id, text: html }));
      setModalOpen(false);
    }
  };
  const TitleCom = () => {
    return (
      <>
        <div className={styles.icon}>{hotSvg}</div>
        <div className={`${styles.title} ${status ? styles.no_hot_title : ""}`}>
          {title}
        </div>
      </>
    );
  };

  return (
    <>
      <div
        className={styles.list_item}
        onClick={() => {
          dispatch(asyncEditHot({ parentId, status: !status, id }));
          // setHot(!hot);
        }}
      >
        <TitleCom />
        <div className={styles.handle_icon}>
          <img src={handleIcon} alt="" />
          <div className={styles.handle_list_box}>
            <ul className={styles.handle_list}>
              <li onClick={handleEdit}>编辑</li>
              <li
                onClick={(event: React.MouseEvent<HTMLLIElement>) => {
                  event.stopPropagation();
                  handleRemove();
                }}
              >
                删除
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Modal
        open={modalOpen}
        title={<Title weekStr={weekStr} dateStr={dateStr} />}
        footer={<Footer onRemove={handleRemove} onSave={handleGetHtml} />}
        style={{ width: "50rem" }}
        onClose={() => setModalOpen(false)}
      >
        <div className={styles.modal_content}>
          <div
            className={styles.modal_title}
            onClick={() => {
              dispatch(asyncEditHot({ parentId, status: !status, id }));
            }}
          >
            <TitleCom />
          </div>
          <MyEditor text={text} ref={editor} />
        </div>
      </Modal>
    </>
  );
}

export default memo(ListItem);
