import { useState } from "react"
import axios from 'axios'
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useNavigate } from "react-router-dom"
import { Base_URL } from '../utils/constants'
import Footer from "./Footer"
import { Link } from "react-router-dom"

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()
  const [useEmail, setUseEmail] = useState("")
  const [usePassword, setUsePassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLogin, setIsLogin] = useState(true)

  const dispatch = useDispatch()

  const handleLogin = async () => {
    try {
      // First authenticate the user
      await axios.post(
        Base_URL + "/login",
        {
          emailId: useEmail,
          password: usePassword,
        },
        { withCredentials: true },
      )

      // Then immediately fetch the full profile so Redux has
      // all details without requiring a manual refresh
      const profileRes = await axios.get(Base_URL + "/profile", {
        withCredentials: true,
      })

      dispatch(addUser(profileRes.data))
      navigate("/profile")
    } catch (err) {
      setErrorMessage(err?.response?.data || "Something went wrong!")
    }
  }

  const handleSignUp = async () => {
    try {
      await axios.post(
        Base_URL + "/signup",
        {
          firstName,
          lastName,
          emailId: useEmail,
          password: usePassword,
        },
        { withCredentials: true },
      )

      // After signup, fetch the freshly created profile
      const profileRes = await axios.get(Base_URL + "/profile", {
        withCredentials: true,
      })

      dispatch(addUser(profileRes.data))
      navigate("/profile")
    } catch (err) {
      setErrorMessage(err?.response?.data || "Something went wrong!")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) handleLogin()
    else handleSignUp()
  }

  return (
    <>
      <div className="flex justify-center mt-20 px-4">
        <form
          className="fieldset bg-base-200 border-base-300 rounded-box w-full sm:w-96 border p-6"
          onSubmit={handleSubmit}
        >
          <legend className="fieldset-legend text-xl font-bold mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </legend>

          {!isLogin && (
            <>
              <label className="label">First Name</label>
              <input
                type="text"
                className="input mb-2"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setErrorMessage("") }}
              />

              <label className="label">Last Name</label>
              <input
                type="text"
                className="input mb-2"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setErrorMessage("") }}
              />
            </>
          )}

          <label className="label">Email</label>
          <input
            type="email"
            className="input mb-2"
            placeholder="Email"
            value={useEmail}
            onChange={(e) => { setUseEmail(e.target.value); setErrorMessage("") }}
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input mb-2"
            placeholder="Password"
            value={usePassword}
            onChange={(e) => { setUsePassword(e.target.value); setErrorMessage("") }}
          />

          {errorMessage && <p className="mt-2 text-red-400">{errorMessage}</p>}

          <button
            type="submit"
            className={`mt-4 btn ${isLogin ? "btn-success" : "btn-warning"} w-full`}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <div className="flex justify-center gap-1 mt-3 text-sm">
            {isLogin ? (
              <>
                <p>Not a user?</p>
                <p className="cursor-pointer text-blue-500" onClick={() => setIsLogin(false)}>Sign Up</p>
              </>
            ) : (
              <>
                <p>Already a user?</p>
                <p className="cursor-pointer text-blue-500" onClick={() => setIsLogin(true)}>Sign in now</p>
              </>
            )}
          </div>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default Login
