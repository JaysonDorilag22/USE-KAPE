import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/images/logo.png";
import { FiShoppingCart } from "react-icons/fi";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-white-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <img src={logo} alt="Logo" className="h-10 w-15" />
        </Link>
        <div className="flex items-center"> {/* Wrap avatar and cart in a flex container */}
          <div className="dropdown dropdown-end ml-2"> {/* Cart dropdown */}
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
                  <button className="btn  btn-outline">View cart</button>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end ml-5"> {/* Avatar dropdown */}
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              {currentUser ? (
                <div className="w-10 rounded-full">
                  <img src={currentUser.avatar} alt="profile" />
                </div>
              ) : (
                <li className=" text-slate-700 hover:underline"> Sign in</li>
              )}
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings">Orders
                <div className="badge badge-error bg-red-600 text-white badge-sm">34</div>
                </Link>
              </li>
              <li>
                <Link to="/logout">Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

// import { FaSearch } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import logo from "../assets/images/logo.png";

// export default function Header() {
//   const { currentUser } = useSelector((state) => state.user);

//   return (
//     <header className="bg-white-200 shadow-md">
//       <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
//         <Link to={"/"}>
//           <img src={logo} alt="Logo" className="h-10 w-15" />
//         </Link>
//         <form className="bg-slate-100 p-3 rounded-lg flex items-center">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="bg-transparent focus:outline-none w-24 sm:w-64"
//           />
//           <FaSearch className="text-slate-700 " />
//         </form>
//         <div className="dropdown dropdown-end">
//           <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
//             {currentUser ? (
//               <div className="w-10 rounded-full">
//                 <img src={currentUser.avatar} alt="profile" />
//               </div>
//             ) : (
//               <li className=" text-slate-700 hover:underline"> Sign in</li>
//             )}
//           </label>
//           <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
//             <li>
//               <Link to="/profile" className="justify-between">
//                 Profile
//               </Link>
//             </li>
//             <li>
//               <Link to="/settings">Cart
//               <span className="badge bg-red-600 text-white">30</span>
//               </Link>
//             </li>
//             <li>
//               <Link to="/signout">Sign out</Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </header>
//   );
// }


// import React from "react";
// import logo from "../assets/images/logo.png";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { BiSearch, BiCart } from "react-icons/bi"; // Import BiCart

// export default function Header() {
//   const { currentUser } = useSelector((state) => state.user);

//   return (
//     <div>
//       <div className="navbar bg-base-100">
//         <div className="flex-1">
//           <Link to={"/"}>
//             <img src={logo} alt="Logo" className="h-10 w-15" />
//           </Link>
//         </div>
//         <div className="flex-none">
//           <div className="dropdown dropdown-end">
//             <label tabIndex={0} className="btn btn-ghost btn-circle">
//               <div className="indicator">
//                 <span className="badge badge-sm indicator-item">8</span>
//               </div>
//             </label>
//             <div
//               tabIndex={0}
//               className="mt-3 z-10 card card-compact dropdown-content w-52 bg-base-100 shadow"
//             >
//               <div className="card-body">
//                 <span className="font-bold text-lg">
//                   <BiSearch /> 8 Items
//                 </span>
//                 <span className="text-info">Subtotal: $999</span>
//                 <div className="card-actions">
//                   <button className="btn btn-primary btn-block">
//                     <BiCart /> View cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="dropdown dropdown-end">
//             <label tabIndex={0} className="btn btn-ghost btn-circle avatar hidden">
//               <Link to="/profile">
//                 {currentUser ? (
//                   <img
//                     className="rounded-full h-7 w-7 object-cover"
//                     src={currentUser.avatar}
//                     alt="profile"
//                   />
//                 ) : (
//                   <span className="text-slate-700 hover:underline">Sign in</span>
//                 )}
//               </Link>
//             </label>
//             <ul
//               tabIndex={0}
//               className="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-100 rounded-box w-52"
//             >
//               <li>
//                 <a className="justify-between">
//                   Profile
//                   <span className="badge">New</span>
//                 </a>
//               </li>
//               <li>
//                 <a>Settings</a>
//               </li>
//               <li>
//                 <a>Logout</a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
