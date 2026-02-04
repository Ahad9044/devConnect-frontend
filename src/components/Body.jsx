import { Outlet, useNavigate, useLocation } from "react-router-dom"
import Header from "./Header"
import { Base_URL } from "../utils/constants"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import axios from "axios"
import { useEffect } from "react"


const Body = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const fetchUser = async () => {
    try {
      const response = await axios.get(Base_URL + "/profile", {
        withCredentials: true,
      })
      dispatch(addUser(response.data))
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login")
      } else {
        console.error("Failed to fetch user profile:", err)
      }
    }
  }
    useEffect(() => {
      // Avoid unnecessary profile calls while on the login page
      if (location.pathname === "/login") return
      fetchUser()
    }, [location.pathname])
  

  return (
    <div>
      <Header />
      <Outlet />
      
    </div>
  )
}

export default Body
