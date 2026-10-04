import "./Login.css";

function Login() {
    return(
        <div className="login-page">

            <div className="login-container">
                
                <div className="login-header">
                    <h1>SmartRoad</h1>
                    <p>AI Based Road Condition Monitoring</p>
                    <p>& Maintenance Decision Support System</p>                
                </div>

                <div className="login-card">

                    <h2>Login</h2>
                    <p className="login-subtitles">Sign in to access the SmartRoad dashboard</p>

                    <form>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="Enter your email" />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="Enter your password" />
                        </div>

                        <button type="submit" className="login-button">Login</button>

                    </form>

                    <p className="register-link">
                            Do not have an account?{" "}
                            <a href="/register">Register</a>
                    </p>

                </div>

                <p className="login-footer">SmartRoad © 2026</p>

            </div>

        </div>
    );
}

export default Login;