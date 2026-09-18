import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">

      <div>
        <h2>Dashboard</h2>
      </div>

      <div className="navbar-user">
        <span>Admin</span>
        <button>Logout</button>
      </div>

    </header>
  );
}

export default Navbar;