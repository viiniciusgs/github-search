import { useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'

const GET_USER = gql`
  query GetUser($username: String!) {
    user(login: $username) {
      name
      login
      bio
      avatarUrl
      url
      repositories(first: 100, privacy: PUBLIC) {
        edges {
          node {
            id
            name
            description
            url
          }
        }
      }
    }
  }
`

interface Repository {
  node: {
    id: string
    name: string
    description: string
    url: string
  }
}

interface User {
  username?: string
  name?: string
  login?: string
  bio?: string
  avatarUrl?: string
  url?: string
  repositories?: {
    edges: Repository[]
  }
}

interface UserData {
  user: User
}

function App() {
  const [username, setUsername] = useState<string>('')
  const [repositoriesIsVisible, setRepositoriesIsVisible] =
    useState<boolean>(false)

  const [getUser, { loading, error, data }] = useLazyQuery<UserData, User>(
    GET_USER
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    getUser({ variables: { username } })
    setRepositoriesIsVisible(false)
  }

  return (
    <main className="min-h-screen h-full px-52 md:px-4 py-20 md:py-4 bg-black flex flex-col items-center justify-start font-body text-white">
      <form
        className="w-full flex justify-between gap-4 md:gap-1"
        onSubmit={e => handleSubmit(e)}
      >
        <input
          className="w-full px-6 md:px-4 py-4 md:py-2 border border-white rounded-lg bg-black font-light"
          type="text"
          placeholder="digite um usuário do github..."
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button
          className="px-12 md:px-6 py-4 rounded-lg bg-blue hover:drop-shadow-md hover:contrast-125 font-semibold"
          type="submit"
        >
          buscar
        </button>
      </form>

      {loading && <p className="mt-4">Carregando...</p>}

      {error && (
        <p className="mt-4">
          Ops, aconteceu algum erro! Verifique o usuário digitado e tente
          novamente.
        </p>
      )}

      {data && (
        <>
          <div className="w-full mt-10 px-10 py-10 flex gap-10 border border-white rounded-t-lg md:flex-col md:items-center">
            <img
              className="w-40 h-40 rounded-full"
              src={data?.user.avatarUrl}
              alt="avatar"
            />
            <div className="w-full text-white md:flex md:flex-col md:items-center">
              <p className="text-3xl md:text-2xl font-semibold md:text-center">
                {data?.user.name}
              </p>
              <a
                className="text-base text-blue"
                href={data?.user.url}
                target="_blank"
                rel="noreferrer"
              >
                {data?.user.login}
              </a>
              <p className="mt-4 text-base md:text-center">{data?.user.bio}</p>
            </div>
          </div>

          <button
            className="w-full py-5 border border-white rounded-b-lg hover:text-blue"
            onClick={() => setRepositoriesIsVisible(!repositoriesIsVisible)}
          >
            Repositórios
          </button>

          {repositoriesIsVisible && (
            <div className="w-full mt-16 grid grid-cols-2 md:grid-cols-1 gap-2">
              {data?.user?.repositories?.edges.map((repository: Repository) => (
                <a
                  className="w-full px-6 py-4 border border-blue rounded-lg hover:bg-blue"
                  key={repository.node.id}
                  href={repository.node.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p className="mb-2 text-lg font-bold">
                    {repository.node.name}
                  </p>
                  <p className="text-sm">{repository.node.description}</p>
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default App
