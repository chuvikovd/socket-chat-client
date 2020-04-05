import { createContext, Context } from 'react'

type NotificationType = 'error' | 'success'
export interface Notification {
  id: number
  type: NotificationType
  message: string
  timeout: NodeJS.Timeout
}

interface NotificationsContextType {
  notifications: Notification[]
  addNotification: (
    notification: Pick<Notification, 'type' | 'message'>
  ) => void
}

const NotificationsContext: Context<NotificationsContextType> = createContext(
  {} as NotificationsContextType
)
export const { Provider } = NotificationsContext
export default NotificationsContext
