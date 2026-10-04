import "./Register.css";

function Register() {
  return (
    <div className="register-page">

      <div className="register-container">

        <div className="register-header">
          <h1>SMARTROAD</h1>
          <p>AI Based Road Condition Monitoring</p>
          <p>& Maintenance Decision Support System</p>
        </div>

        <div className="register-card">

          <h2>Create Account</h2>

          <p className="register-subtitle">
            Register to access the SmartRoad system
          </p>

          <form>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
              />
            </div>

            <button type="submit" className="register-button">
              Register
            </button>

          </form>

          <p className="login-link">
            Already have an account?{" "}
            <a href="/login">Login</a>
          </p>

        </div>

        <p className="register-footer">
          SmartRoad © 2026
        </p>

      </div>

    </div>
  );
}

export default Register;