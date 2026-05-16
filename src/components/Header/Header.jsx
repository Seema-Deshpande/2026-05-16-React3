import { Navbar, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const handleLogin = () => {
    // Your Code Here
    navigate('/login')
  };

  const handleSignup = () => {
    // Your Code Here
    navigate('/register')
  };

  const handleLogout = () => {
    // Your Code Here
    // Clear token and user info from state and localStorage
    logout();
    navigate('/login')  
  };

  return (
    <Navbar className="header-navbar shadow-sm">
      <Container
        fluid
        className="header-container d-flex justify-content-between align-items-center"
      >
        <div className="d-flex align-items-center">
          <h1 className="header-logo" onClick={() => navigate("/home")}>
            ThreadHive
          </h1>
        </div>
        <div className="d-flex align-items-center">
          {token ? (
            <>
              <Button className="btn-header btn-outline me-2" onClick={() => navigate(`/profile`)}>
                View Profile
              </Button>
              <Button className="btn-header btn-primary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                className="btn-header btn-outline me-2"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button className="btn-header btn-primary" onClick={handleSignup}>
                Register
              </Button>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
