import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Base_URL } from "../utils/constants"
import { removeUser } from "../utils/userSlice"
import { BsChatLeftDots } from 'react-icons/bs';
import { LiaUserFriendsSolid } from 'react-icons/lia';


const Header = () => {
  const user = useSelector((store) => store.user) || []
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClick = async () => {
    try {
      await axios.post(Base_URL + "/logout", {},
        { withCredentials: true })
      dispatch(removeUser())
      return navigate("/login")
    } catch (err) {
      console.log(err)
    }

  }

  return (
    <div>
      <div className="navbar bg-base-400 shadow-lg px-4 sm:px-6">
        <div className="flex-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg "
          >
            {/* Icon */}
            <lord-icon
              src="https://cdn.lordicon.com/jdgfsfzr.json"
              // trigger="hover"
              colors="primary:#ffffff"
              style={{ width: "40px", height: "40px" }}
            ></lord-icon>

            {/* Text */}
            <span className="text-white font-bold text-2xl tracking-wide">
              devConnect
            </span>
          </Link>
        </div>
{ user?._id && 
        <div className="flex gap-2">
          <Link to="requests"> <div className="mr-5 mt-3 text-2xl"><LiaUserFriendsSolid /></div></Link>
          <Link to="connections"><div className=" mr-10 mt-4 text-xl"><BsChatLeftDots /></div></Link>
          <h3 className="mr-3 mt-3 hidden sm:block "> Welcome, <span className="font-bold">{user.firstName}</span></h3>
          <div className="dropdown dropdown-end">
            {user && <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar mr-6">
              <div className="w-10 rounded-full ">
                <img

                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li><Link to="/requests">Requests</Link></li>
              <li><Link to="/connections">Connections</Link></li>
              <li>
                <a onClick={handleClick}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
}
      </div>
    </div>
  )
}

export default Header
