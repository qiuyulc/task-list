import styles from './index.module.less'
export default function LayoutFooter() {
    
    return <footer className={styles.footer}>
    <div className={styles.footer_content}>
      <span>📨 联系我们</span> &nbsp;|&nbsp;<span>👋 关于项目</span>
    </div>
  </footer>
}

