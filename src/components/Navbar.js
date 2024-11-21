import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifiez si le token est présent dans localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/SignIn");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-between w-full">
        <li>
          <Link href="/Home" className="font-cinzel text-white text-large">
            Dev De La Dépression
          </Link>
        </li>
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link href="/SignIn" className="text-white">
                  SignIn
                </Link>
              </li>
              <li>
                <Link href="/SignUp" className="text-white">
                  SignUp
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
