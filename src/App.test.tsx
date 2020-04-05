import React from 'react'
import {
  render,
  fireEvent,
  wait,
  act,
  RenderResult,
} from '@testing-library/react'
import WS from 'jest-websocket-mock'
import App from './App'

describe('Chat app', () => {
  it('displays error on login', async () => {
    ;(global as any).fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 403,
        text: () => Promise.resolve('Username already taken'),
      })
    )

    const { getByLabelText, getByText } = render(<App />)

    const input = getByLabelText('Username')
    const button = getByText("Let's chat")

    act(() => {
      fireEvent.change(input, { target: { value: 'John' } })
    })
    act(() => {
      fireEvent.click(button)
    })

    await wait(() => {
      getByText('Username already taken')
    })
  })

  describe('chat', () => {
    const wss = new WS(`ws://${process.env.REACT_APP_API_URL}`)

    const login = (app: RenderResult) => {
      ;(global as any).fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
        })
      )

      const { getByLabelText, getByText } = app

      const input = getByLabelText('Username')
      const button = getByText("Let's chat")

      act(() => {
        fireEvent.change(input, { target: { value: 'John' } })
      })
      act(() => {
        fireEvent.click(button)
      })
    }

    it('can login', async () => {
      const app = render(<App />)
      const onConnect = jest.fn()
      wss.on('connection', onConnect)

      login(app)

      await wait(() => {
        expect(onConnect).toHaveBeenCalled()
      })
    })

    describe('logged', () => {
      it('receives messages', async () => {
        const app = render(<App />)
        wss.on('connection', (ws) => {
          ws.send(
            JSON.stringify({
              type: 'message',
              user: 'Maria',
              message: 'Hi there',
            })
          )

          ws.send(
            JSON.stringify({
              type: 'userDisconnected',
              user: 'Maria',
            })
          )

          ws.send(
            JSON.stringify({
              type: 'userConnected',
              user: 'Brad',
            })
          )

          ws.send(
            JSON.stringify({
              type: 'userTimeout',
              user: 'Bob',
            })
          )
        })

        login(app)

        await wait(() => {
          app.getByText('Hi there')
        })
        await wait(() => {
          app.getByText('User Maria disconnected')
        })
        await wait(() => {
          app.getByText('User Brad connected')
        })
        await wait(() => {
          app.getByText('User Bob disconnected by the server due to inactivity')
        })
      })

      it('can send message', async () => {
        const app = render(<App />)

        wss.on('connection', (ws) => {
          ws.on('message', (message) => {
            ws.send(
              JSON.stringify({
                type: 'message',
                user: 'John',
                message,
              })
            )
          })
        })

        login(app)

        const { getByLabelText, getByText } = app

        await wait(() => {
          getByText('Exit')
        })

        const input = getByLabelText('Message')
        const send = getByText('Send')

        act(() => {
          fireEvent.change(input, { target: { value: 'Is enyone here?' } })
        })
        act(() => {
          fireEvent.click(send)
        })

        await wait(() => {
          app.getByText('Is enyone here?')
        })
      })

      it('can disconnect', async () => {
        const app = render(<App />)

        login(app)

        const { getByText } = app

        await wait(() => {
          getByText('Exit')
        })

        const exit = getByText('Exit')

        act(() => {
          fireEvent.click(exit)
        })

        await wait(() => {
          getByText("Let's chat")
        })
      })

      it('shows message when disconnected by server', async () => {
        const app = render(<App />)

        wss.on('connection', (ws) => {
          setTimeout(() => {
            ws.close({ code: 1000, reason: 'timeout', wasClean: true })
          }, 500)
        })

        login(app)

        const { getByText } = app

        await wait(() => {
          getByText('Exit')
        })

        await wait(() => {
          getByText('Disconnected from server due to inactivity')
        })
      })
    })
  })
})
