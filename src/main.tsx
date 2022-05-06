import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createHttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import App from './App'

import './global.css'

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
)
