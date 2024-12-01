import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../redux/authSlice";
import router from "next/router";

const Navbar = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Verifique o token apenas no navegador
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      // Exemplo: Carregar dados do usuário a partir do token
      const userData = JSON.parse(localStorage.getItem("user")); // Salve dados do usuário no localStorage
      dispatch(login(userData));
    }
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    router.push("/SignIn");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link href="/" legacyBehavior>
            <a>Auth Exercise</a>
          </Link>
        </div>
        <div className="flex space-x-4 items-center">
          {isLoggedIn ? (
            <>
              <li className="text-white flex items-center">
                <i className="fas fa-user-circle mr-2"></i>
                {user?.email}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/SignIn" legacyBehavior>
                  <a className="text-white">SignIn</a>
                </Link>
              </li>
              <li>
                <Link href="/SignUp" legacyBehavior>
                  <a className="text-white">SignUp</a>
                </Link>
              </li>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
