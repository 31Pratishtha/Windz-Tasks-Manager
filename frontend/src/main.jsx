import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from './Router.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (import.meta.env.VITE_NODE_ENV === 'production') disableReactDevTools()
ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<Router />
		</Provider>
	</React.StrictMode>
)
