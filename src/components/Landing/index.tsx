import React, {
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
  useContext,
} from 'react'
import { useHistory } from 'react-router-dom'
import { NotificationsContext } from '../Notifications'
import styles from './styles.module.scss'

export interface LandingProps {
  setUsername: (username: string) => void
}

const Landing: React.FC<LandingProps> = ({ setUsername }) => {
  const { addNotification } = useContext(NotificationsContext)
  const [usernameValue, setUsernameValue] = useState('')
  const history = useHistory()

  const handleNameChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
      setUsernameValue(value),
    []
  )

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()

      try {
        const result = await fetch(
          `http://${process.env.REACT_APP_API_URL}/login`,
          {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ username: usernameValue }),
          }
        )

        if (!result.ok) {
          throw new Error(await result.text())
        }

        setUsername(usernameValue)
        history.push('/chat')
      } catch (error) {
        addNotification({ type: 'error', message: error.message })
      }
    },
    [usernameValue, history, setUsername, addNotification]
  )

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label className={styles.label} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          value={usernameValue}
          onChange={handleNameChange}
          className={styles.input}
        />
      </div>
      <button type="submit" disabled={!usernameValue} className={styles.button}>
        Let's chat
      </button>
    </form>
  )
}

export default Landing
