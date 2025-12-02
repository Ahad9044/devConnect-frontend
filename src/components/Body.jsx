import { Outlet, useNavigate } from "react-router-dom"
import Header from "./Header"
import { Base_URL } from "../utils/constants"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import axios from "axios"
import { useEffect } from "react"


const Body = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {
      {
        const response = await axios.get(Base_URL + "/profile", {
          withCredentials: true
        })
        // console.log(response)
        dispatch(addUser(response.data))
      }
    }
    catch (err) {
      if(err.status == 401){

        navigate("/login")
        console.log(err)
      }
    }
  }
    useEffect(() => {
      fetchUser()
    }, [])
  

  return (
    <div>
      <Header />
      <Outlet />
      
    </div>
  )
}

export default Body
