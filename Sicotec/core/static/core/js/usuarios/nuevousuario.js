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
});

document
  .getElementById("BtnAgregarUsuario")
  .addEventListener("click", LimpiarCampos);

//para ediar al usuario
document
  .querySelector("#tblUsuarios tbody")
  .addEventListener("click", async function (event) {
    if (
      event.target.classList.contains("editBtn") ||
      event.target.closest(".editBtn")
    ) {
      let idRegistroUsuario = event.target.closest("tr").getAttribute("id");
      document.getElementById("txtIdModalEditarUsuario").value =
        idRegistroUsuario;
      CargardatoUsuario(idRegistroUsuario);
    }
  });

document
  .querySelector("#tblUsuarios tbody")
  .addEventListener("click", async function (event) {
    if (
      event.target.classList.contains("toggleBtn") ||
      event.target.closest(".toggleBtn")
    ) {
      const button = event.target.closest("tr");
      const userId = button.getAttribute("id");

      try {
        const response = await fetch("../../usuario/cambioestado/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        });

        const result = await response.json();

        if (result.success) {
          data = result.data;
          const row = document.querySelector(`#tblUsuarios tr[id="${userId}"]`);
          if (row) {
            // Actualiza los datos en la fila
            row.querySelector("th:nth-child(1)").textContent = data.id;
            row.querySelector("th:nth-child(2)").textContent = data.nombre;
            row.querySelector("th:nth-child(3)").textContent = data.apellido;
            row.querySelector("th:nth-child(4)").textContent = data.area;
            row.querySelector("th:nth-child(5)").textContent = data.usuario;

            const statusBtn = row.querySelector(".toggleBtn");
            if (statusBtn) {
              statusBtn.classList.toggle("btn-success", data.is_active);
              statusBtn.classList.toggle("btn-danger", !data.is_active);
              statusBtn.querySelector("i").className = data.is_active
                ? "bi bi-check-circle"
                : "bi bi-x-circle";
              statusBtn.innerHTML = `${
                data.is_active
                  ? '<i class="bi bi-check-circle"></i> Active'
                  : '<i class="bi bi-x-circle"></i> Inactive'
              }`;
              statusBtn.setAttribute("data-is-active", data.is_active);
            }
          }
        } else {
          console.error("Error al actualizar el estado:", result.message);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    }
  });

document
  .querySelector("#tblUsuarios  tbody")
  .addEventListener("click", function (event) {
    if (
      event.target.classList.contains("trashBtn") ||
      event.target.closest(".trashBtn")
    ) {
      let idregistoeliminar = event.target.closest("tr").getAttribute("id");
      document.getElementById("txtIdProyectoModalEliminarUsuario").value =
        idregistoeliminar;
    }
  });

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
    const idusuario = document.getElementById("txtIdModalEditarUsuario").value;

    const isActiveCheckbox = document.getElementById("isActiveCheckbox");
    const isActive = isActiveCheckbox ? isActiveCheckbox.checked : false;

    console.log("nombre: " + nombre);

    const data = {
      idusuario,
      nombre,
      apellido,
      area,
      email,
      username,
      password,
      is_active: isActive,
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
          usuarioss = response.data;
          console.log("los usuarios");
          console.log(usuarioss);

          const tablaBody = document.querySelector("#tblUsuarios tbody");
          let html = "";
          usuarioss.forEach((us) => {
            html += `
                <tr id="${us.id}">
                <th>${us.nombre}</th>
                <th>${us.apellido}</th>
                <th>${us.area}</th>
                <th class ="text-center" >${us.usuario}</th>
                <th class ="text-center">
                <button
                    type="button"
                    class="btn toggleBtn ${
                      us.is_active ? "btn-success" : "btn-danger"
                    }"
                    data-is-active="${us.is_active}"
                >
                    ${
                      us.is_active
                        ? '<i class="bi bi-check-circle"></i> Active'
                        : '<i class="bi bi-x-circle"></i> Inactive'
                    }
                </button>
                </th>
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

//eliminar evento
document
  .getElementById("formEliminarUsuario")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const idregistro = document.getElementById(
      "txtIdProyectoModalEliminarUsuario"
    ).value;

    const csrftoken = getCookie("csrftoken");

    // Ocultar el modal
    const modalElement = document.getElementById("modalEliminarUsuario");
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }
    modalInstance.hide();

    console.log(idregistro);

    fetch("../../usuario/eliminarusuario/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        idRegistro: idregistro,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success === true) {
          const row = document.querySelector(
            `#tblUsuarios tr[id="${idregistro}"]`
          );
          if (row) {
            row.remove();
          }
          NotificacionSwal("Éxito!", response.message, "success", "ok");
        } else {
          NotificacionSwal("Error!", response.message, "error", "ok");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
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
    "txtIdModalEditarUsuario",
  ];
  ids.forEach(function (id) {
    const campo = document.getElementById(id);
    if (campo) {
      campo.value = "";
    }
  });
}

async function CargardatoUsuario(idRegistroUsuario) {
  const url = `../../usuario/getusuario/${idRegistroUsuario}`;
  const csrftoken = getCookie("csrftoken");
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRFToken": csrftoken,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      NotificacionSwal("Error!", errorData.message, "error", "ok");
    } else {
      const result = await response.json();
      const data = result.data;
      console.log(data);

      document.getElementById("txtNombres").value = data.nombre;
      document.getElementById("txtApellidos").value = data.apellido;
      document.getElementById("txtarea").value = data.area;
      document.getElementById("txtEmail").value = data.email;
      document.getElementById("txtUsername").value = data.usuario;
      document.getElementById("txtContraseña").value = "";
      document.getElementById("isActiveCheckbox").checked = data.is_active;
    }
  } catch (error) {
    NotificacionSwal(
      "Error!",
      "Hubo un problema al procesar la solicitud",
      "error",
      "ok"
    );
  }
}
