import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

function NavBarAdmin() {
  const navigate = useNavigate();
  return (
    <AppBar position="static" sx={{ backgroundColor: "#00489A", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "center", gap: 2 }}>
        <Button color="inherit" component={Link} to="/admin/home" sx={{ textTransform: "none", fontWeight: 500 }}>
          Home Admin
        </Button>
        <Button color="inherit" component={Link} to="/admin/users" sx={{ textTransform: "none", fontWeight: 500 }}>
          Users
        </Button>
        <Button color="inherit" component={Link} to="/admin/users" sx={{ textTransform: "none", fontWeight: 500 }}>
          zorra
        </Button>
        <AccountCircleIcon fontSize="large" sx={{ cursor: "pointer" }} onClick={() => navigate("/profile")} />
      </Toolbar>
    </AppBar>
  );
}


export default NavBarAdmin;