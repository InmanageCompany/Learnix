import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#00489A", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "center", gap: 2 }}>
        <Button color="inherit" component={Link} to="/" sx={{ textTransform: "none", fontWeight: 500 }}>
          Home
        </Button>
        <Button color="inherit" component={Link} to="/register" sx={{ textTransform: "none", fontWeight: 500 }}>
          Registrarse
        </Button>
        <Button color="inherit" component={Link} to="/login" sx={{ textTransform: "none", fontWeight: 500 }}>
          Iniciar sesión
        </Button>
        <Button color="inherit" component={Link} to="/student/login" sx={{ textTransform: "none", fontWeight: 500 }}>
          Estudiantes
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;