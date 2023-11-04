import { useDispatch } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/images/logo.png";
import { FiShoppingCart } from "react-icons/fi";
import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from "../../src/redux/user/userSlice.js";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <header className="bg-white-200 shadow-md">
  <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
    <Link to={"/"}>
      <img src={logo} alt="Logo" className="h-10 w-15" />
    </Link>
    {currentUser ? (
      <div className="flex items-center">
        <div className="dropdown dropdown-end ml-2">
          {/* Cart dropdown */}
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <FiShoppingCart className="h-5 w-5" />
              <span className="badge badge-sm indicator-item">8</span>
            </div>
          </label>
          <div className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
            <div className="card-body">
              <span className="font-bold text-lg">8 Items</span>
              <span className="text text-green-600">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-outline">View cart</button>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end ml-5">
          {/* Avatar dropdown */}
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            {currentUser ? (
              <div className="w-10 rounded-full">
                <img src={currentUser.avatar} alt="profile" />
              </div>
            ) : (
              <li className="text-slate-700 hover:underline"> Sign in</li>
            )}
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/orders">
                Orders
                <div className="badge badge-error bg-red-600 text-white badge-sm">
                  34
                </div>
              </Link>
            </li>
            <li>
              <Link to="/" onClick={handleSignOut}>
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    ) : (
      <Link to="/sign-in">
        <button className="btn btn-outline">Sign in</button>
      </Link>
    )}
  </div>
</header>

  );
}
