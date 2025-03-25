import styles from "./index.module.less";
import HeaderCom from "@/components/ui/header";
import { useDate } from "./useDate";
import { Select } from "@/components/ui";
import MyEditor from "@/components/ui/editor";
import Modal from "@/components/ui/modal";
import Item from "../home/components/banner-item";
import { TitleCom } from "@/views/home/components/list/list-item";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { initializeHistory } from "@/redux/store/history-reducer";
function getDaysInMonth(year: number, month: number) {
  // 注意：月份从0开始计数，所以要减去1
  return new Date(year, month, 0).getDate();
}
const History = () => {
  const dispatch = useAppDispatch();
  const year = useDate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEdit, setModalEdit] = useState({
    status: false,
    title: "",
    text: "",
  });
  const { history_list = {} } = useAppSelector(
    (state) => state.historyListReducer
  );

  const [form, setForm] = useState<{ year: string; month: string }>({
    year: "",
    month: "",
  });

  useEffect(() => {
    if (form.month && form.year) {
      const number = getDaysInMonth(parseInt(form.year), parseInt(form.month));
      // const list = Array.from({ length: number }, (_, index) => {
      //   return form.year + "/" + form.month + "/" + (index + 1);
      // });
      dispatch(
        initializeHistory({
          start: form.year + "/" + form.month + "/1",
          end: form.year + "/" + form.month + "/" + number,
          date: form.year + "/" + form.month,
        })
      );
    }
  }, [form.year, form.month, dispatch]);

  const list = useMemo(() => {
    return history_list[`${form.year}/${form.month}`] || [];
  }, [history_list, form]);
  return (
    <div className={styles.history}>
      <HeaderCom>
        <h3>历史记录</h3>
      </HeaderCom>

      <div className={styles.date_box}>
        <Select
          placeholder="请选择年份"
          value={form.year}
          options={[...year.map((u) => ({ label: u+'年', value: u }))]}
          onChange={(val: string) => {
            setForm({
              ...form,
              year: val,
            });
          }}
        />
        <Select
          style={{ marginLeft: "10px" }}
          placeholder="请选择月份"
          value={form.month}
          options={[
            ...[
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
            ].map((u) => {
              return { label: u+'月', value: u };
            }),
          ]}
          onChange={(val: string) => {
            setForm({
              ...form,
              month: val,
            });
          }}
        />
      </div>
      <div className={styles.history_content}>
        {list.length > 0 ? (
          <div className={styles.history_padding}>
            {[...list]
              .filter((u) => Array.isArray(u.list) && u.list.length > 0)
              .map((item) => {
                return (
                  <Item
                    {...item}
                    key={item.id}
                    hot={false}
                    style={{ marginBottom: "10px", height: "33.12rem" }}
                    parentId={item.id}
                  >
                    <div className={styles.list_box}>
                      {Array.isArray(item.list) && item.list.length > 0
                        ? item.list.map((u) => {
                            return (
                              <div
                                key={u.id}
                                onClick={() => {
                                  setModalOpen(true);
                                  setModalEdit({
                                    status: u.status,
                                    title: u.title,
                                    text: u.text || "",
                                  });
                                }}
                                className={styles.list_item}
                              >
                                <TitleCom status={u.status} title={u.title} />
                                {/* <span className={`${styles.list_item_title} ${u.status ? styles.status:''}`}>{u.title}</span> */}
                              </div>
                            );
                          })
                        : ""}
                    </div>
                  </Item>
                );
              })}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.empty_img}></div>
            <div className={styles.empty_text}>你可能没有添加任务嘞！</div>
          </div>
        )}
      </div>
      <Modal
        open={modalOpen}
        title={
          <div
            style={{
              display: "flex",
              lineHeight: "4.39rem",
              paddingLeft: "18px",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <h3>详细信息({modalEdit.status ? "已完成" : "未完成"})</h3>
          </div>
        }
        footer={<></>}
        style={{ width: "50rem" }}
        onClose={() => setModalOpen(false)}
      >
        <div className={styles.modal_content}>
          <div className={styles.modal_title} onClick={() => {}}>
            <TitleCom status={modalEdit.status} title={modalEdit.title} />
          </div>
          {/* <div dangerouslySetInnerHTML={{__html: modalEdit.text}}></div> */}
          <div className={styles.modal_text}>
            <MyEditor text={modalEdit.text} disable={true} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default History;
