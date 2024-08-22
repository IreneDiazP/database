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
      CargardatoEventos(idRegistroUsuario);
    }
  });

  document
  .querySelector("#tblUsuarios tbody")
  .addEventListener("click", async function (event) {
    if (event.target.classList.contains("toggleBtn") || event.target.closest(".toggleBtn")) {
      const button = event.target.closest("tr");
      const userId = button.getAttribute("id");

      try {
        const response = await fetch('../../usuario/cambioestado/', { // Cambia esta URL a la de tu vista Django
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Obtén el CSRF token si lo estás usando
          },
          body: JSON.stringify({
            user_id: userId,
          })
        });

        const result = await response.json();

        if (result.success) {
        NotificacionSwal("Éxito!", result.message, "success", "ok");

        //   // Actualizar el botón basado en el nuevo estado
        //   button.classList.toggle('btn-success', newStatus);
        //   button.classList.toggle('btn-danger', !newStatus);
        //   button.querySelector('i').className = newStatus ? 'bi bi-check-circle' : 'bi bi-x-circle';
        //   button.setAttribute('data-is-active', newStatus);
        //   console.log('Estado actualizado correctamente');


        } else {
          console.error('Error al actualizar el estado:', result.message);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
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
    // Usar el ID correcto para el checkbox
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
      is_active: isActive, // Incluir el estado activo en los datos enviados
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
                <th>${us.usuario}</th>
                <th>
                    ${
                      us.is_active
                        ? '<span class="badge bg-success">Activo</span>'
                        : '<span class="badge bg-danger">Inactivo</span>'
                    }
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

async function CargardatoEventos(idRegistroUsuario) {
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


function toggleStatus(button) {
    const isActive = button.getAttribute('data-is-active') === 'true';

    // Cambiar las clases del botón basado en el estado actual
    if (isActive) {
        button.classList.remove('btn-success');
        button.classList.add('btn-danger');
        button.querySelector('i').className = 'bi bi-x-circle'; // Cambiar ícono a inactivo
        button.setAttribute('data-is-active', 'false');
    } else {
        button.classList.remove('btn-danger');
        button.classList.add('btn-success');
        button.querySelector('i').className = 'bi bi-check-circle'; // Cambiar ícono a activo
        button.setAttribute('data-is-active', 'true');
    }
}
