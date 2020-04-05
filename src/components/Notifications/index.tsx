import React, { useState, useMemo, useCallback, useRef } from 'react'
import clsx from 'clsx'
import NotificationsContext, { Provider, Notification } from './context'
import styles from './styles.module.scss'

const NotificationsProvider: React.FC = ({ children }) => {
  const countRef = useRef(1)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: number) => {
    setNotifications((notifications) => {
      const index = notifications.findIndex(
        ({ id: notificationId }) => notificationId === id
      )

      if (index < 0) return notifications

      return [
        ...notifications.slice(0, index),
        ...notifications.slice(index + 1),
      ]
    })
  }, [])

  const addNotification = useCallback(
    (notification: Pick<Notification, 'message' | 'type'>) => {
      const id = countRef.current++

      setNotifications((notifications) => [
        ...notifications,
        {
          id,
          timeout: setTimeout(() => {
            removeNotification(id)
          }, 5000),
          ...notification,
        },
      ])
    },
    [removeNotification]
  )

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
    }),
    [notifications, addNotification]
  )

  return (
    <Provider value={value}>
      {children}
      <div className={styles.container}>
        {notifications.map(({ id, message, type }) => (
          <div
            key={id}
            className={clsx(styles.notification, { [styles[type]]: type })}
          >
            {message}
          </div>
        ))}
      </div>
    </Provider>
  )
}

export { NotificationsContext }
export default NotificationsProvider
