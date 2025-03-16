import {
  ReactNode,
  useState,
  useEffect,
  // useCallback,
  CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import styles from "./index.module.less";

interface ModalProps {
  title?: string | ReactNode;
  open: boolean;
  onClose?: () => void;
  children?: string | ReactNode;
  footer?: string | ReactNode;
  style?: CSSProperties;
}

const Modal = (props: ModalProps) => {
  const [visible, setVisible] = useState(false);
  const { title, open, onClose, children, style = {}, footer } = props;

  useEffect(() => {
    if (open) {
      setVisible(true);
    }
  }, [open]);

  return visible
    ? createPortal(
        <div
          className={styles.mask}
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          <div
            style={{ ...style }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onAnimationStart={() => {
              if (!open) {
                setTimeout(() => {
                  setVisible(false);
                },300);
              }
            }}
            className={`${styles.modal_content} ${
              open ? styles.modal_show : styles.modal_hide
            }`}
          >
            <div className={styles.modal_header}>
              <div className={styles.title}>{title}</div>
              <div
                className={styles.icon}
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <svg
                  className={styles.cross_icon}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.content}>{children}</div>
            <div className={styles.footer}>{footer}</div>
          </div>
        </div>,
        document.body
      )
    : null;
};


export default Modal;
