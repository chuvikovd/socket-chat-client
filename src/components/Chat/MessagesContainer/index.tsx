import React, { useRef, useEffect } from 'react'
import Message from '../Message'
import { Message as MessageType } from '../../../types'
import styles from './styles.module.scss'

interface MessagesContainerProps {
  messages: MessageType[]
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({ messages }) => {
  const scrollAnchor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAnchor.current)
      scrollAnchor.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <div ref={scrollAnchor} />
    </div>
  )
}

export default MessagesContainer
