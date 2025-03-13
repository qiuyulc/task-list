import styles from './app.module.less'

import {Outlet } from 'react-router'
function App() {

  return (
    <main className={styles.app}>
      <Outlet></Outlet>
    </main>
  )
}

export default App
