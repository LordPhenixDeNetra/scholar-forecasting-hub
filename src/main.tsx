// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ThemeProvider } from './components/theme-provider'
// import App from './App'
// import './index.css'
//
// const queryClient = new QueryClient()
//
// ReactDOM.createRoot(document.getElementById('root')!).render(
//     <React.StrictMode>
//         <ThemeProvider
//             attribute="class"
//             defaultTheme="system"
//             enableSystem
//             disableTransitionOnChange
//         >
//             <QueryClientProvider client={queryClient}>
//                 <App />
//             </QueryClientProvider>
//         </ThemeProvider>
//     </React.StrictMode>
// )





import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)



