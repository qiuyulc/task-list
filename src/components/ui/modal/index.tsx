import {
  ReactNode,
  useState,
  useEffect,
  // useCallback,
  CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import styles from "./index.module.less";
import { createRoot, Root } from "react-dom/client";

interface ModalProps {
  title?: string | ReactNode;
  open: boolean;
  onClose?: () => void;
  children?: string | ReactNode;
  footer?: string | ReactNode;
  style?: CSSProperties;
  NodeDom?: HTMLDivElement;
}

const Modal = (props: ModalProps) => {
  const [visible, setVisible] = useState(false);
  const { title, open, onClose, children, style = {}, footer, NodeDom } = props;
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
                }, 300);
              }
            }}
            className={`${styles.modal_content} ${
              open ? styles.modal_show : styles.modal_hide
            }`}
          >
            {title ? (
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
            ) : (
              ""
            )}
            <div className={styles.content}>{children}</div>
            <div className={styles.footer}>{footer}</div>
          </div>
        </div>,
        NodeDom || document.body
      )
    : null;
};

const Footer = ({
  onOk,
  onClose,
}: {
  onOk?: () => void;
  onClose?: () => void;
}) => {
  return (
    <div className={styles.footer_btn}>
      <div
        className={styles.save_btn}
        onClick={() => {
          if (onOk) {
            onOk();
          }
        }}
      >
        确认
      </div>
      <div
        className={styles.close}
        onClick={() => {
          if (onClose) {
            onClose();
          }
        }}
      >
        取消
      </div>
    </div>
  );
};

const ModalContent = (props: {
  title?: ModalProps["title"];
  children?: ModalProps["children"];
}) => {
  const { title, children } = props;
  return (
    <div className={styles.modal_title_content}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
};

Modal.confirm = (props: Omit<ModalProps, "open"> & { onOk?: () => void }) => {
  const { title, onClose, children, style = {}, onOk } = props;

  let confirmRoot: Root | null = null;

  let element: HTMLDivElement | null = null;

  let open = true;
  const confirmOk = () => {
    if (onOk) {
      onOk();
    }

    confirmClose();
  };
  const confirmClose = () => {
    open = false;
    render({ children, style });
    if (onClose) {
      onClose();
    }
    destroy();
  };

  function render(
    renderProps: Omit<ModalProps, "open" | "footer" | "onClose" | "title">
  ) {
    return confirmRoot?.render(
      <Modal
        {...renderProps}
        title={""}
        children={<ModalContent title={title} children={children} />}
        footer={<Footer onOk={confirmOk} onClose={confirmClose} />}
        onClose={confirmClose}
        open={open}
        NodeDom={element as HTMLDivElement}
      />
    );
  }

  const destroy = () => {
    setTimeout(() => {
      if (confirmRoot) {
        confirmRoot.unmount();
        confirmRoot = null;
        document.getElementById("confirm_id")?.remove();
      }
    }, 300);
  };

  // 创建渲染源
  const createMessageRoot = () => {
    if (!document.getElementById("confirm_id")) {
      element = document.createElement("div");
      element.id = "confirm_id";
      document.body.appendChild(element);
    }

    if (document.getElementById("confirm_id") && !confirmRoot) {
      confirmRoot = createRoot(
        document.getElementById("confirm_id") as HTMLElement
      );
    }
  };

  createMessageRoot();
  render({ children, style });
  return {
    destroy,
  };
};

export default Modal;
