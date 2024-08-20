document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#tblEntidades tbody")
    .addEventListener("click", async function (event) {
      if (
        event.target.classList.contains("editBtn") ||
        event.target.closest(".editBtn")
      ) {
        let idRegistroEntidad = event.target.closest("tr").getAttribute("id");
        document.getElementById("txtIdModalEditarEntidad").value =
          idRegistroEntidad;
        console.log("hola" + idRegistroEntidad);
        CargardatoEntidad(idRegistroEntidad);
      }
    });

  document
    .getElementById("BtnAgregarEntidad")
    .addEventListener("click", limpiarCampos);

    document.getElementById('formEditarEntidad').addEventListener('submit',function(event){
      event.preventDefault()
      idEntidad = document.getElementById('txtIdModalEditarEntidad').value
      Entidad = document.getElementById('txtNombreEntidad').value
  
      data={
        Entidad,
        idEntidad,
      }

      console.log(data)

      const urlpost= '../../mantenimiento/editarentidad/'
      const csrftoken = getCookie("csrftoken");
      fetch(urlpost,{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(data),
      }).then((response) => response.json()).then((response) =>{
        if(response.success){
          entidades = response.data
          console.log(entidades)
          NotificacionSwal("Éxito!", response.message, "success", "ok")

          const tablaBody = document.querySelector("#tblEntidades tbody")
          let html = ""
          entidades.forEach(ent => {
            html += `
                <tr id="${ent.id}">
                    <th>${ent.entidad_financiamiento}</th>
                    <th>
                        <div class="d-flex gap-2 justify-content-center">
                            <button type="button" class="btn btn-success editBtn" data-bs-toggle="modal"
                                data-bs-target="#modalEditarEntidad" data-bs-whatever="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-danger trashBtn" data-bs-toggle="modal"
                                data-bs-target="#modalEliminarEntidad" data-bs-whatever="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </th>
                </tr>
            `;
        });

        tablaBody.innerHTML = html;
        const modalElement = document.getElementById("modalEditarEntidad");
        const modal = bootstrap.Modal.getInstance(modalElement);
        limpiarCampos()
        if (modal) {
          modal.hide();
        }

        }
      })
    })

    // Manejar clic en el botón de eliminar en la tabla
    document
      .querySelector("#tblEntidades tbody")
      .addEventListener("click", function (event) {
        if (
          event.target.classList.contains("trashBtn") ||
          event.target.closest(".trashBtn")
        ) {
          let idRegistroEliminar = event.target.closest("tr").getAttribute("id");
          document.getElementById("txtIdModalEliminarEntidad").value =idRegistroEliminar;
          console.log("El id para eliminar: " + idRegistroEliminar);
        }
      });

    // // Manejar el envío del formulario de eliminación
    document
      .getElementById("formEliminarEntidad")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        const idRegistro = document.getElementById(
          "txtIdModalEliminarEntidad"
        ).value;
        const csrftoken = getCookie("csrftoken");

        // Ocultar el modal
        const modalElement = document.getElementById(
          "modalEliminarEntidad"
        );
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (!modalInstance) {
          modalInstance = new bootstrap.Modal(modalElement);
        }
        modalInstance.hide();

        // Datos a enviar
        const data = {
          idEntidad: idRegistro,
        };

        fetch("../../mantenimiento/eliminarEntidad/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.success) {
              // Eliminar fila en la tabla
              const row = document.querySelector(
                `#tblEntidades tr[id="${idRegistro}"]`
              );
              if (row) {
                row.remove();
              }

              // Mostrar notificación de éxito
              NotificacionSwal("Éxito!", responseData.message, "success", "Ok");
            } else {
              // Mostrar notificación de error
              NotificacionSwal(
                "Error!",
                responseData.message || "Ocurrió un error.",
                "error",
                "Ok"
              );
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            NotificacionSwal(
              "Error!",
              "Ocurrió un error al realizar la solicitud.",
              "error",
              "Ok"
            );
          });
      });

});

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

async function CargardatoEntidad(idRegistroEntidad) {
  console.log("este es el id");
  console.log(typeof idRegistroEntidad);
  const urlpost = `../../mantenimiento/getEntidad/${idRegistroEntidad}`;
  console.log(urlpost);
  const csrftoken = getCookie("csrftoken");
  try {
    const response = await fetch(urlpost, {
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

      document.getElementById("txtNombreEntidad").value = data.nombreEntidad;
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

function limpiarCampos() {
  const campos = ["txtNombreEntidad", "txtIdModalEditarEntidad"];

  campos.forEach((campo) => {
    document.getElementById(campo).value = "";
  });
}
