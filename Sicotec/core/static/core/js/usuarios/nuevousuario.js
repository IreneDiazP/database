document.addEventListener("DOMContentLoaded", function () {
  const nombreInput = document.getElementById("txtNombres");
  const apellidoInput = document.getElementById("txtApellidos");
  const usernameInput = document.getElementById("txtUsername");
  const passwordinput = document.getElementById("txtContraseña");

  nombreInput.addEventListener("input", ActualizarPassUser);
  apellidoInput.addEventListener("input", ActualizarPassUser);

  function ActualizarPassUser() {
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();

    if (nombre && apellido) {
      const firstInitial = nombre.charAt(0).toLowerCase();
      const firstSurname = apellido.split(" ")[0].toLowerCase();

      const username = `${firstInitial}${firstSurname}`;

      usernameInput.value = username;
      passwordinput.value = "12345678";
    } else {
      usernameInput.value = "";
    }
  }

  document
    .getElementById("formAgregarUsuario")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const nombre = document.getElementById("txtNombres").value;
      const apellido = document.getElementById("txtApellidos").value;
      const area = document.getElementById("txtarea").value;
      const email = document.getElementById("txtEmail").value;
      const username = document.getElementById("txtUsername").value;
      const password = document.getElementById("txtContraseña").value;
      console.log("nombre" + nombre);

      const data = {
        nombre,
        apellido,
        area,
        email,
        username,
        password,
      };
      console.log(data);
      const url = "../../usuario/agregarusuario/";
      const csrftoken = getCookie("csrftoken");

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            NotificacionSwal("Éxito!", response.message, "success", "ok");
            LimpiarCampos();
            usuarios = response.data;
            console.log("los usuarios");
            console.log(usuarios);

            const tablaBody = document.querySelector("#tblUsuarios tbody");
            let html = "";
            usuarios.forEach((us) => {
              html += `
                  <tr id="${us.id}">
                    <th>${us.nombre}</th>
                    <th>${us.apellido}</th>
                    <th>${us.area}</th>
                    <th>${us.usuario}</th>
                      <th>
                          <div class="d-flex gap-2 justify-content-center">
                              <button type="button" class="btn btn-success editBtn" data-bs-toggle="modal"
                                  data-bs-target="#modalEditarUsuario" data-bs-whatever="Editar">
                                  <i class="bi bi-pencil"></i>
                              </button>
                              <button type="button" class="btn btn-danger trashBtn" data-bs-toggle="modal"
                                  data-bs-target="#modalEliminarUsuario" data-bs-whatever="Eliminar">
                                  <i class="bi bi-trash"></i>
                              </button>
                          </div>
                      </th>
                  </tr>
              `;
            });

            tablaBody.innerHTML = html;
            const modalElement = document.getElementById("modalEditarUsuario");
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          } else {
            NotificacionSwal("Error!", response.message, "error", "ok");
          }
        });
    });
});

//cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function LimpiarCampos() {
  const ids = [
    "txtNombres",
    "txtApellidos",
    "txtarea",
    "txtEmail",
    "txtUsername",
    "txtContraseña",
  ];
  ids.forEach(function (id) {
    const campo = document.getElementById(id);
    if (campo) {
      campo.value = "";
    }
  });
}
