import * as React from 'react'
import styles from '../styles/container.module.css'

export default function Container({ children }: any) {
    return <div className={styles.container}>
        {children}
    </div>
}