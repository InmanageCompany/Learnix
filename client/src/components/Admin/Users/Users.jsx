import NavBarAdmin from '../NavBar/NavBar';
import { useState, useEffect } from 'react';
import axios from "axios";
import Button from "@mui/material/Button";

// Si tus rutas se llaman distinto, solo cambiás estas líneas
const API = "http://localhost:3000/api/admin";
const URL_USERS = `${API}/users`;                 // GET lista de usuarios
const URL_ROLES = `${API}/roles`;                 // GET lista de roles
const URL_CREATE = `${API}/createUser`;           // POST
const URL_UPDATE = `${API}/updateUser`;           // PUT   /:id
const URL_SUSPEND = `${API}/deleteUser`;          // DELETE /:id (baja lógica)
const URL_REACTIVATE = `${API}/reactivateUser`;   // PATCH /:id

const emptyForm = {
    role_id: "", name: "", date_of_birth: "", phone: "",
    cuil: "", tuition: "", email: "", password: ""
};

function UsersAdmin() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null); // null = estamos creando
    const [showForm, setShowForm] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);

    const token = localStorage.getItem("token");
    const headers = { Authorization: token };

    // Mismo manejo de errores que ya usás en el resto de la app
    const handleError = (error) => {
        if (error.response)
            alert(error.response.data.message);
        else if (error.request)
            alert("No hay respuesta del servidor.");
        else
            alert(`Error: ${error.message}`);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(URL_USERS, { headers });
            // Solo guardamos si es una lista, así nunca se rompe el .map
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(URL_ROLES, { headers });
            setRoles(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            handleError(error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    // Un solo handler para todos los inputs (usa el atributo name)
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const openCreate = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
    };

    // A diferencia del Perfil, acá cargamos los datos actuales en el formulario
    const openEdit = (user) => {
        setForm({
            role_id: user.role_id ?? "",
            name: user.name ?? "",
            date_of_birth: user.date_of_birth ? String(user.date_of_birth).slice(0, 10) : "",
            phone: user.phone ?? "",
            cuil: user.cuil ?? "",
            tuition: user.tuition ?? "",
            email: user.email ?? "",
            password: ""
        });
        setEditingId(user.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const saveUser = async () => {
        const payload = {
            ...form,
            phone: String(form.phone).replace(/\D/g, ''),
            cuil: String(form.cuil).replace(/\D/g, '')
        };
        // No mandamos contraseña vacía ni a los estudiantes, ni matrícula a los demás roles
        if (!payload.password || isStudent) delete payload.password;
        if (!isStudent) delete payload.tuition;

        try {
            if (editingId)
                await axios.put(`${URL_UPDATE}/${editingId}`, payload, { headers });
            else
                await axios.post(URL_CREATE, payload, { headers });

            closeForm();
            fetchUsers();
        } catch (error) {
            handleError(error);
        }
    };

    // Baja lógica: el backend solo pone isActive = false
    const suspendUser = async (user) => {
        if (!window.confirm(`¿Suspender a ${user.name}?`)) return;
        try {
            await axios.delete(`${URL_SUSPEND}/${user.id}`, { headers });
            fetchUsers();
        } catch (error) {
            handleError(error);
        }
    };

    const reactivateUser = async (user) => {
        try {
            await axios.patch(`${URL_REACTIVATE}/${user.id}`, {}, { headers });
            fetchUsers();
        } catch (error) {
            handleError(error);
        }
    };

    // Igual que en Perfil: los estudiantes no llevan contraseña
    const selectedRole = roles.find((r) => String(r.id) === String(form.role_id));
    const isStudent = selectedRole?.name === "student";

    return (
        <>
            <NavBarAdmin />
            <div className="teacher-page">
                <h1>Usuarios</h1>

                {/* Botones de arriba, debajo de la barra de navegación */}
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
                    <Button variant="contained" onClick={openCreate} sx={{ backgroundColor: "#2196F3" }}>
                        Crear usuario
                    </Button>
                    <Button
                        variant={deleteMode ? "contained" : "outlined"}
                        color="error"
                        onClick={() => setDeleteMode(!deleteMode)}
                    >
                        {deleteMode ? "Terminar" : "Suspender usuarios"}
                    </Button>
                </div>

                {/* Formulario compartido para crear y modificar */}
                {showForm && (
                    <div className="login-container">
                        <h2>{editingId ? "Modificar usuario" : "Nuevo usuario"}</h2>

                        <select name="role_id" value={form.role_id} onChange={handleChange}>
                            <option value="">Seleccionar rol</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>

                        <input type="text" name="name" placeholder="Nombre completo" value={form.name} onChange={handleChange} />
                        <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
                        <input type="text" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} />
                        <input type="text" name="cuil" placeholder="Cuil" value={form.cuil} onChange={handleChange} />
                        <input type="text" name="tuition" placeholder="Matrícula" value={form.tuition} onChange={handleChange} />
                        <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} />
                        {!isStudent && (
                            <input
                                type="password"
                                name="password"
                                placeholder={editingId ? "Nueva contraseña (opcional)" : "Contraseña"}
                                value={form.password}
                                onChange={handleChange}
                            />
                        )}

                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                            <Button variant="contained" onClick={saveUser} sx={{ backgroundColor: "#2196F3" }}>
                                {editingId ? "Actualizar" : "Crear"}
                            </Button>
                            <Button variant="outlined" onClick={closeForm}>Cancelar</Button>
                        </div>
                    </div>
                )}

                {users.length === 0 ? (
                    <p>No hay usuarios registrados.</p>
                ) : (
                    users.map((item) => (
                        <div className="feature-card" key={item.id} style={{ opacity: item.isActive ? 1 : 0.6 }}>
                            <h3>{item.name}</h3>
                            <p>Rol: {item.role?.name}</p>
                            <p>Email: {item.email}</p>
                            <p>Teléfono: {item.phone}</p>
                            <p>CUIL: {item.cuil}</p>
                            <p>Matrícula: {item.tuition}</p>
                            <p>Estado: {item.isActive ? "Activo" : "Suspendido"}</p>

                            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                <Button variant="contained" onClick={() => openEdit(item)} sx={{ backgroundColor: "#2196F3" }}>
                                    Modificar
                                </Button>

                                {/* Solo aparece al activar "Suspender usuarios" */}
                                {deleteMode && item.isActive && (
                                    <Button variant="contained" color="error" onClick={() => suspendUser(item)}>
                                        Suspender
                                    </Button>
                                )}

                                {/* Los suspendidos siempre se pueden reactivar */}
                                {!item.isActive && (
                                    <Button variant="outlined" onClick={() => reactivateUser(item)}>
                                        Reactivar
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default UsersAdmin;