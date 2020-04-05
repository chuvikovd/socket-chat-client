import React, { useState, useMemo } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Notifications from './components/Notifications'
import Landing from './components/Landing'
import Chat from './components/Chat'
import { Provider } from './context'

function App() {
  const [username, setUsername] = useState('')

  const value = useMemo(() => ({ username }), [username])

  return (
    <Notifications>
      <Provider value={value}>
        <BrowserRouter>
          <Switch>
            <Route
              path="/chat"
              render={() => {
                if (!username) return <Redirect to="/" />

                return <Chat />
              }}
            />
            <Route
              path="*"
              render={() => <Landing setUsername={setUsername} />}
            />
          </Switch>
        </BrowserRouter>
      </Provider>
    </Notifications>
  )
}

export default App
