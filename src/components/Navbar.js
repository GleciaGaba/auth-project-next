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
            Auth Exercise
          </Link>
        </div>
        <div className="flex space-x-4 items-center">
          {isLoggedIn ? (
            <>
              <div className="text-white flex items-center">
                <div className="fas fa-user-circle mr-2"></div>
                {user?.email}
              </div>
              <div>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-white">
                <Link href="/SignIn" legacyBehavior>
                  SignIn
                </Link>
              </div>
              <div className="text-white">
                <Link href="/SignUp" legacyBehavior>
                  SignUp
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
