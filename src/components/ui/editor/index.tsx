import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import styles from "./index.module.less";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

export type Props = {
  text: string;
  disable?: boolean;
};
export type refProps = {
  getHtml: () => string;
} | null;

const MyEditor = forwardRef<refProps, Props>((props, ref) => {
  const { text, disable } = props;
  // 编辑器实例，必须
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法

  // 编辑器内容
  const [html, setHtml] = useState(text);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: [
      "headerSelect",
      "blockquote",
      "|",
      "bold",
      "underline",
      "italic",
      "color",
      "bgColor",
      "fontSize",
      "|",
      "bulletedList",
      "numberedList",
      "todo",
      "insertLink",
      "insertTable",
    ],
  }; // TS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
  };

  useEffect(() => {
    if (disable) {
      editor?.disable();
    }
  }, [disable, editor]);
  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  useImperativeHandle(
    ref,
    () => {
      return {
        getHtml: () => {
          return html;
        },
      };
    },
    [html]
  );
  return (
    <>
      <div className={styles.editor}>
        <Toolbar
          className={styles.toolbar}
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
        />
        <Editor
          className={styles.editor_com}
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
        />
      </div>
    </>
  );
});

export default MyEditor;
