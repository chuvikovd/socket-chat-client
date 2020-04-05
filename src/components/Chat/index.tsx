import React, {
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import { useHistory } from 'react-router-dom'
import { Message as MessageType } from '../../types'
import { NotificationsContext } from '../Notifications'
import appContext from '../../context'
import MessagesContainer from './MessagesContainer'
import Form from './Form'
import styles from './styles.module.scss'

export default () => {
  const history = useHistory()
  const { username } = useContext(appContext)
  const { addNotification } = useContext(NotificationsContext)
  const wsRef = useRef<WebSocket | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<MessageType[]>([])

  const onMessage = useCallback(
    (message) =>
      setMessages((messages) => [...messages, JSON.parse(message.data)]),
    []
  )

  const getMessageFromReason = (reason: string) => {
    switch (reason) {
      case 'timeout':
        return 'Disconnected from server due to inactivity'
      case 'shutdown':
        return 'Server has been shut down'
      default:
        return null
    }
  }

  useEffect(() => {
    const ws = new WebSocket(
      `ws://${process.env.REACT_APP_API_URL}?username=${username}`
    )
    ws.onopen = () => setLoading(false)

    ws.onmessage = onMessage

    ws.onclose = ({ reason }) => {
      const message = getMessageFromReason(reason)

      if (message)
        addNotification({
          type: 'error',
          message,
        })

      history.push('/')
    }

    wsRef.current = ws

    return () => ws.close()
  }, [onMessage, username, history, addNotification])

  const onSubmit = useCallback(
    (message: string) => {
      if (wsRef.current) wsRef.current.send(message)
    },
    [wsRef]
  )

  const handleExit = useCallback(() => {
    if (!wsRef.current) return

    wsRef.current.close()
  }, [])

  if (loading) return <span>loading</span>

  return (
    <div className={styles.wrapper}>
      <button className={styles.exit} onClick={handleExit}>
        Exit
      </button>
      <div className={styles.chat}>
        <MessagesContainer messages={messages} />
        <Form onSubmit={onSubmit} />
      </div>
    </div>
  )
}
