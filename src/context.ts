import { createContext, Context } from 'react'

const context: Context<{ username: string }> = createContext({ username: '' })
export const { Provider } = context
export default context
