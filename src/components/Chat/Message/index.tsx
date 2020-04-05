import React, { useContext, useMemo, useCallback } from 'react'
import clsx from 'clsx'
import appContext from '../../../context'
import { Message as MessageType } from '../../../types'
import styles from './styles.module.scss'

interface MessageProps {
  message: MessageType
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { username } = useContext(appContext)
  const { type, user } = message
  const chatMessage = useMemo(() => type === 'message', [type])

  const getServiceMessageText = useCallback(({ type, user }) => {
    switch (type) {
      case 'userConnected':
        return `User ${user} connected`
      case 'userDisconnected':
        return `User ${user} disconnected`
      case 'userTimeout':
      default:
        return `User ${user} disconnected by the server due to inactivity`
    }
  }, [])

  return (
    <div
      className={clsx(styles.message, {
        [styles.self]: chatMessage && user === username,
      })}
    >
      {chatMessage ? (
        <React.Fragment>
          <div className={styles.author}>{user}</div>
          <div className={styles.text}>{(message as any).message}</div>
        </React.Fragment>
      ) : (
        <div className={styles.info}>{getServiceMessageText(message)}</div>
      )}
    </div>
  )
}

export default Message
