import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#00489A", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "center", gap: 2 }}>
        <Button color="inherit" component={Link} to="/" sx={{ textTransform: "none", fontWeight: 500 }}>
          Home
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;