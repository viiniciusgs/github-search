import { gql, useQuery } from '@apollo/client'

const GET_USER = gql`
  query GetUser {
    user(login: "viiniciusgs") {
      name
    }
  }
`

interface User {
  name: string
}

interface UserData {
  user: User
}

function App() {
  const { loading, error, data } = useQuery<UserData, User>(GET_USER)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <main className="h-screen bg-black flex flex-col items-center justify-center font-body">
      <h1 className="text-white">Hello World!</h1>
      <p className="text-blue">{data?.user.name}</p>
    </main>
  )
}

export default App
