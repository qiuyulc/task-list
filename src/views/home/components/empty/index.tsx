import styles from './index.module.less'

import one from '@/assets/images/one.svg';
import two from '@/assets/images/two.svg';
import three from '@/assets/images/three.svg';
import four from '@/assets/images/four.svg';
import five from '@/assets/images/five.svg';
import six from '@/assets/images/six.svg';
import seven from '@/assets/images/seven.svg';
import { ReactNode } from 'react';

const Empty = ({weekStr,text}:{weekStr:string,text?:string|ReactNode})=>{

    const week = ["一", "二", "三", "四", "五", "六", "天"];
    const images = [one, two, three, four, five, six, seven];

    const index = week.indexOf(weekStr);
    return <div className={styles.empty}>
        <div className={styles.empty_img} style={{backgroundImage:`url(${images[index]})`}}></div>
        <div className={styles.empty_text}>
        {text||'暂无数据'}
        </div>

    </div>
}

export default Empty