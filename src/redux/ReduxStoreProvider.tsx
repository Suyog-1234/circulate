"use client"
import { CommonComponentProps } from '@/types/common'
import { FC } from 'react'
import { Provider } from 'react-redux'
import store from './store'

interface ReduxStoreProvider extends CommonComponentProps{
  
}

const ReduxStoreProvider: FC<ReduxStoreProvider> = ({children}) => {
  return (
      <Provider store={store}>
          {children}
      </Provider>
  )
}

export default ReduxStoreProvider