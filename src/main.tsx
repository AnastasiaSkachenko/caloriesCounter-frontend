import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools'



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,   
      refetchOnMount: true,       
      refetchOnReconnect: true,   
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode> 
      <QueryClientProvider client={queryClient}>
        <App /> 
      </QueryClientProvider> 
  </React.StrictMode>,
)
