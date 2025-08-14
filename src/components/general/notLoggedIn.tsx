import React from "react"
import { useNavigate } from "react-router-dom"

  
interface NotLoggedInProps {
  message: string
}


const NotLoggedIn: React.FC<NotLoggedInProps> = ({message}) => {
  const navigate = useNavigate()
  
  return (
    <div className="modal-body">
      <p>{message}</p>
      <div className="d-flex justify-content-around">
        <button onClick={() => navigate('/register')} >Register</button>
        <button onClick={() => navigate('/login')} >Login</button>
      </div>
    </div>
  )
}

export default NotLoggedIn