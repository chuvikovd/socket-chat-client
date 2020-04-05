export type ServiceMessageType = 'userConnected' | 'userDisconnected'
export type ChatMessageType = 'message'
export type MessageType = ChatMessageType | ServiceMessage

export interface ServiceMessage {
  type: ServiceMessageType
  user: string
}

export interface ChatMessage {
  type: ChatMessageType
  user: string
  message: string
}

export type Message = ServiceMessage | ChatMessage
