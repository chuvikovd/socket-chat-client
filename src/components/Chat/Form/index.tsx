import React, { useState, useCallback, FormEvent, ChangeEvent } from 'react'
import styles from './styles.module.scss'

interface FormProps {
  onSubmit: (message: string) => void
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState('')

  const handleMessageChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setMessage(value),
    []
  )

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault()

      onSubmit(message)
      setMessage('')
    },
    [onSubmit, message]
  )

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={message}
        onChange={handleMessageChange}
      />
      <button className={styles.button} type="submit" disabled={!message}>
        Send
      </button>
    </form>
  )
}

export default Form
