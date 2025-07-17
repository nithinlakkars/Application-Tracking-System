import React from "react";
import { useNavigate } from "react-router-dom";
import procorp_logo from "../assets/procorp_logo.jpeg";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid d-flex justify-content-between">
          <span className="navbar-brand mb-0 h1">
            <img src={procorp_logo} alt="" height={50} />
          </span>

          <button
            className="btn btn-outline-danger ms-auto"
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
