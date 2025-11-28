import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <Button variant="contained" color="error" onClick={handleLogout}>
      Cerrar sesión
    </Button>
  );
}

export default LogoutButton;