// import StrictMode from React to help identify potential problems in the application
import { StrictMode } from 'react'
// import createRoot to render the React application
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// import the main App component
import App from './App.jsx'

// render the App component inside StrictMode for highlighting potential issues
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> {/* Main App Component */}
  </StrictMode>,
)
