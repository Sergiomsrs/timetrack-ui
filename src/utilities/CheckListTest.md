##  Checklist de Funcionalidades - App Timetrack

---

###  Autenticación y Seguridad
- [ ] Fichaje con credenciales correctas
- [ ] Fichaje con credenciales incorrectas
- [ ] Acceso a la aplicación en caso de contraseña correcta
- [ ] Acceso a la aplicación en caso de contraseña incorrecta
- [ ] Generación de JWT al iniciar sesión
- [ ] Autenticación basada en DNI y contraseña
- [ ] Logout elimina el token del cliente
---

###  Control de Acceso por Rol
- [ ] Funcionan las vistas restringidas
- [ ] Vistas restringidas para ADMIN
- [ ] Vistas restringidas para USER
- [ ] Vistas restringidas para GUEST (solo visualización)
- [ ] GUEST no puede editar ni fichar
- [ ] ADMIN puede gestionar usuarios y fichajes
- [ ] USER puede fichar y ver sus registros

---

###  Gestión de Usuarios
- [ ] Funciona el CRUD sobre los usuarios
- [ ] Se renderiza la lista de usuarios
- [ ] Funciona el buscador por nombre
- [ ] Se puede editar la información de un usuario
- [ ] Se puede eliminar un usuario
- [ ] Se puede añadir un nuevo usuario
- [ ] Se puede cambiar el rol de un usuario
---

###  Gestión de Fichajes
- [ ] Los trabajadores pueden fichar correctamente
- [ ] Los fichajes se registran 
- [ ] Se listan los fichajes por día
- [ ] Se puede editar un fichaje desde el modal
- [ ] Se puede eliminar un fichaje desde el modal
- [ ] Se pueden añadir fichajes manualmente desde el modal
- [ ] Se sincronizan los cambios con la API correctamente

---

###  Gestión de Registros Diarios
- [ ] Se agrupan los fichajes por fecha
- [ ] Se puede ver el detalle diario de fichajes
- [ ] Los fichajes se ordenan cronológicamente

### Automatización de Ausencias
- [ ] El sistema detecta horarios previstos sin fichajes para cada empleado
- [ ] Las ausencias se registran en la base de datos 
- [ ] Las ausencias se notifican por email 

### Informes en PDF (JasperReports)
- [ ] Se generan informes en PDF correctamente
- [ ] Los datos del informe se extraen correctamente de la base de datos

---


