import { useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'

const GET_USER = gql`
  query GetUser($username: String!) {
    user(login: $username) {
      name
    }
  }
`

interface User {
  username?: string
  name?: string
}

interface UserData {
  user: User
}

function App() {
  const [username, setUsername] = useState<string>('')

  const [getUser, { loading, error, data }] = useLazyQuery<UserData, User>(
    GET_USER
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <main className="h-screen px-52 py-20 bg-black flex flex-col items-center justify-start font-body text-white">
      <div className="w-full flex justify-between gap-4">
        <input
          className="w-full px-6 py-4 border border-white rounded-lg bg-black font-light"
          type="text"
          placeholder="digite um usuário do github..."
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button
          className="px-12 py-4 rounded-lg bg-blue hover:drop-shadow-md hover:contrast-125 font-semibold"
          onClick={() => getUser({ variables: { username } })}
        >
          buscar
        </button>
      </div>

      {data && (
        <>
          <h1 className="mt-4 text-white">Hello World!</h1>
          <p className="text-blue">{data?.user.name}</p>
        </>
      )}
    </main>
  )
}

export default App
