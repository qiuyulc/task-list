import {
  ReactNode,
  CSSProperties,
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import styles from "./index.module.less";

export type ValueProps = string | ReactNode;
export interface SelectProps {
  options: {
    label: ValueProps;
    value: ValueProps;
  }[];
  style?: CSSProperties;
  onChange?: (val: string) => void;
  value: string;
  placeholder?: string;
}
export const Select = (props: SelectProps) => {
  const {
    options = [],
    style = {},
    onChange,
    value = "",
    placeholder = "请选择",
  } = props;
  const [show, setShow] = useState(false);
  const select = useRef<HTMLDivElement>(null);
  const modal_select = useRef(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (select.current && show) {
        if (
          e.target !== select.current &&
          !select.current.contains(e.target as Node)
        ) {
          setShow(false);
        }
      }
    };

    if (modal_select.current) {
      document.addEventListener("click", handleClick, false);
    }
    return () => {
      document.removeEventListener("click", handleClick, false);
    };
  }, [modal_select, show]);

  const selectOptions = useMemo(() => {
    if (show) {
      let style = {};
      if (select.current) {
        const { width, height, x, y } = select.current.getBoundingClientRect();
        style = {
          top: `${y + height + 6}px`,
          left: `${x}px`,
          width: `${width}px`,
        };
      }

      return createPortal(
        <div
          className={styles.options_box}
          ref={modal_select}
          style={{ ...style }}
        >
          <div className={styles.options_com}>
            {options.length > 0 ? (
              options.map((item, index) => {
                return (
                  <div
                    className={`${styles.option} ${
                      item.value === value ? styles.optionfocus : ""
                    }`}
                    key={index}
                    onClick={() => {
                      if (onChange) {
                        setShow(false);
                        onChange(item.value as string);
                      }
                    }}
                  >
                    {item.label}
                  </div>
                );
              })
            ) : (
              <div className={styles.empty}>暂无数据</div>
            )}
          </div>
        </div>,
        document.body
      );
    } else {
      return "";
    }
  }, [options, show, onChange, select, value]);

  const label = options.find((item) => item.value === value)?.label;
  return (
    <div className={styles.select} style={{ ...style }} ref={select}>
      <div className={styles.input} onClick={() => setShow(!show)}>
        {value ? (
          label
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
      </div>
      <div
        className={styles.icon}
        style={{ transform: show ? "rotate(180deg)" : "rotate(0deg)" }}
      ></div>

      {selectOptions}
    </div>
  );
};
