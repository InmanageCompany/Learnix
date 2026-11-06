import { AppBar, Toolbar, Button, IconButton, Tooltip, Popover, Badge } from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logoLearnix from "../../../assets/logo-learnix1.png";
import useGradeNotifications from "./useGradeNotifications";

function NavBarStudent() {
  const navigate = useNavigate();
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const { notifications, checkingError, markAsRead } = useGradeNotifications();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <AppBar position="static" className="role-navbar">
      <Toolbar className="role-navbar-toolbar">
        <Link className="role-navbar-brand" to="/student/home" aria-label="Learnix, inicio del estudiante">
          <img src={logoLearnix} alt="" />
          <span>LEARNIX</span>
        </Link>

        <nav className="role-navbar-links" aria-label="Navegación del estudiante">
          <Button color="inherit" component={Link} to="/student/home">
            Inicio
          </Button>
          <Button color="inherit" component={Link} to="/student/reportCards">
            Boletines
          </Button>
        </nav>

        <div className="role-navbar-actions">
          <Tooltip title="Notificaciones">
            <IconButton
              className="role-profile-button"
              color="inherit"
              aria-label="Abrir notificaciones"
              aria-haspopup="true"
              aria-expanded={Boolean(notificationsAnchor)}
              onClick={(event) => setNotificationsAnchor(event.currentTarget)}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Perfil">
            <IconButton
              className="role-profile-button"
              color="inherit"
              aria-label="Abrir perfil"
              onClick={() => navigate("/profile")}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
      <Popover
        open={Boolean(notificationsAnchor)}
        anchorEl={notificationsAnchor}
        onClose={() => setNotificationsAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        className="role-notifications-popover"
      >
        <section className="role-notifications-panel" aria-label="Bandeja de notificaciones">
          <h2>Notificaciones</h2>
          {notifications.length === 0 ? (
            <p className="role-notifications-empty">
              {checkingError || "Te avisaremos cuando se agregue o modifique una nota."}
              {" "}Learnix revisa cambios mientras esta sesión está abierta.
            </p>
          ) : (
            <ul className="role-notifications-list">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`role-notification-item ${notification.read ? "is-read" : "is-unread"}`}
                >
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                  <div className="student-notification-actions">
                    <time dateTime={notification.createdAt}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </time>
                    <Button
                      component={Link}
                      to={`/student/notes/${notification.reportCardId}`}
                      state={{ Report_Card_id: notification.reportCardId }}
                      size="small"
                      onClick={() => {
                        markAsRead(notification.id);
                        setNotificationsAnchor(null);
                      }}
                    >
                      Ver nota
                    </Button>
                    {!notification.read && (
                      <Button size="small" onClick={() => markAsRead(notification.id)}>
                        Marcar leída
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Popover>
    </AppBar>
  );
}

export default NavBarStudent;