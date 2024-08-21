document.addEventListener("DOMContentLoaded", function () {
    document
      .querySelector("#tblTipoApoyo tbody")
      .addEventListener("click", async function (event) {
        if (
          event.target.classList.contains("editBtn") ||
          event.target.closest(".editBtn")
        ) {
          let idRegistroApoyo = event.target.closest("tr").getAttribute("id");
          document.getElementById("txtIdModalEditarTipoApoyo").value =
          idRegistroApoyo;
          console.log("hola" + idRegistroApoyo);
          CargardatoEntidad(idRegistroApoyo);
        }
      });
  
    document
      .getElementById("BtnAgregarTipoApoyo")
      .addEventListener("click", limpiarCampos);
  
      document.getElementById('formEditarTipoApoyo').addEventListener('submit',function(event){
        event.preventDefault()
        idTipoApoyo = document.getElementById('txtIdModalEditarTipoApoyo').value
        tipoApoyo = document.getElementById('txtTipoApoyo').value
    
        data={
          tipoApoyo,
          idTipoApoyo,
        }
  
        console.log(data)
  
        const urlpost= '../../mantenimiento/editartipoapoyo/'
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
            tipoApoyo = response.data
            console.log(tipoApoyo)
            NotificacionSwal("Éxito!", response.message, "success", "ok")
  
            const tablaBody = document.querySelector("#tblTipoApoyo tbody")
            let html = ""
            tipoApoyo.forEach(ta => {
              html += `
                  <tr id="${ta.id}">
                      <th>${ta.tipoapoyo}</th>
                      <th>
                          <div class="d-flex gap-2 justify-content-center">
                              <button type="button" class="btn btn-success editBtn" data-bs-toggle="modal"
                                  data-bs-target="#modalEditarTipoApoyo" data-bs-whatever="Editar">
                                  <i class="bi bi-pencil"></i>
                              </button>
                              <button type="button" class="btn btn-danger trashBtn" data-bs-toggle="modal"
                                  data-bs-target="#modalEliminarTipoApoyo" data-bs-whatever="Eliminar">
                                  <i class="bi bi-trash"></i>
                              </button>
                          </div>
                      </th>
                  </tr>
              `;
          });
  
          tablaBody.innerHTML = html;
          const modalElement = document.getElementById("modalEditarTipoApoyo");
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
        .querySelector("#tblTipoApoyo tbody")
        .addEventListener("click", function (event) {
          if (
            event.target.classList.contains("trashBtn") ||
            event.target.closest(".trashBtn")
          ) {
            let idRegistroEliminar = event.target.closest("tr").getAttribute("id");
            document.getElementById("txtIdModalEliminarTipoApoyo").value =idRegistroEliminar;
            console.log("El id para eliminar: " + idRegistroEliminar);
          }
        });
  
      //  Manejar el envío del formulario de eliminación
      document
        .getElementById("formEliminarTipoApoyo")
        .addEventListener("submit", function (event) {
          event.preventDefault();
  
          const idRegistro = document.getElementById(
            "txtIdModalEliminarTipoApoyo"
          ).value;
          const csrftoken = getCookie("csrftoken");
  
          // Ocultar el modal
          const modalElement = document.getElementById(
            "modalEliminarTipoApoyo"
          );
          let modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (!modalInstance) {
            modalInstance = new bootstrap.Modal(modalElement);
          }
          modalInstance.hide();
  
          // Datos a enviar
          const data = {
            idTipoApoyo: idRegistro,
          };
  
          fetch("../../mantenimiento/eliminartipoapoyo/", {
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
                  `#tblTipoApoyo tr[id="${idRegistro}"]`
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
  
  async function CargardatoEntidad(idRegistroApoyo) {
    console.log("este es el id");
    console.log(typeof idRegistroApoyo);
    const urlpost = `../../mantenimiento/getTipoApoyo/${idRegistroApoyo}`;
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
  
        document.getElementById("txtTipoApoyo").value = data.nombreTipoApoyo;
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
    const campos = ["txtTipoApoyo", "txtIdModalEditarTipoApoyo"];
  
    campos.forEach((campo) => {
      document.getElementById(campo).value = "";
    });
  }
  