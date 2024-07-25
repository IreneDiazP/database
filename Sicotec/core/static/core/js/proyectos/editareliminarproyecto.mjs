// Obtener token con Django
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

// Función para cargar instituciones de financiamiento
async function cargarInstitucionesFinanciamiento(entidadID, selectedId = null) {
  if (entidadID) {
    try {
      const response = await fetch(`/proyecto/getInstituciones/${entidadID}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `La respuesta de la red no fue correcta: ${response.statusText}`
        );
      }

      const data = await response.json();
      const cboInstituciones = document.getElementById(
        "cboTipoInsFinanciamiento"
      );
      cboInstituciones.innerHTML = "<option selected></option>";

      data.forEach(function (item) {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.cInstFinancia;
        if (selectedId && selectedId == item.id) {
          option.selected = true;
        }
        cboInstituciones.appendChild(option);
      });
    } catch (error) {
      console.error("Hubo un problema con la operación de búsqueda:", error);
    }
  } else {
    document.getElementById("cboTipoInsFinanciamiento").innerHTML = "";
  }
}

document
  .getElementById("cboTipoEnFinanciamiento")
  .addEventListener("change", function () {
    cargarInstitucionesFinanciamiento(this.value);
  });

export async function CargardatoProyecto(idRegistroProyecto) {
  const rutaeditar = `../../proyecto/editarproyecto/${idRegistroProyecto}`;
  document.getElementById('formEditarProyecto').setAttribute('action', rutaeditar);

  
  const url = `../../proyecto/getDatosProyecto/${idRegistroProyecto}`;
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
      console.log("pedi los datos");
      console.log(result);

      document.getElementById("cboTipoProyecto").value =
        result.data[0].cTipo_proyecto_id;
      document.getElementById("txtCodigoProyecto").value =
        result.data[0].codigoProyecto;
      document.getElementById("txtNombreProyecto").value =
        result.data[0].nomProyecto;
      document.getElementById("txtDescripcion").value =
        result.data[0].DescProyecto;
      document.getElementById("cboPais").value = result.data[0].cpais_id;
      document.getElementById("cboTipoApoyo").value =
        result.data[0].cTipoApoyo_id;
      document.getElementById("cboTipoEnFinanciamiento").value =
        result.data[0].cEntFinan_id;

      await cargarInstitucionesFinanciamiento(
        result.data[0].cEntFinan_id,
        result.data[0].cInstFinanc_id
      );

      document.getElementById("cboTipoMOneda").value =
        result.data[0].cTipo_Moneda_id;
      document.getElementById("txtMonto").value = result.data[0].monto;
      document.getElementById("txttipoCambio").value =
        result.data[0].tipo_Cambio;
      document.getElementById("txtRespIpen").value = result.data[0].responsable;
      document.getElementById("txtRespEnt").value =
        result.data[0].responsableEnt;
      document.getElementById("cboAreaTematica").value =
        result.data[0].cAreaTem_id;
      document.getElementById("txtFechaInicio").value =
        result.data[0].fechaInicio;
      document.getElementById("txtFechaFin").value = result.data[0].fechaFin;
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

document.getElementById("formEliminarProyecto").addEventListener("submit", function(event){
  event.preventDefault(); 
  const idregistro = document.getElementById("txtIdProyectoModalEliminarProyecto").value;

  let elementoHtmlEditado = $("#tblProyectosRegistro").find(`#${idregistro}`);
  const csrftoken = getCookie("csrftoken");


  // Ocultar el modal
  const modalElement = document.getElementById("modalEliminarProyecto");
  let modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (!modalInstance) {
    modalInstance = new bootstrap.Modal(modalElement);
  }
  modalInstance.hide();
  

  console.log('este es el idregistro: ',idregistro);
  
  fetch("../../proyecto/eliminarProyecto/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken
    },
    body: JSON.stringify({
      action: "delete",
      idRegistro: idregistro,
    })
  })
  .then(response => response.json())
  .then(response => {
    if (response.success === true) {
      elementoHtmlEditado.remove(); 
      const row = document.querySelector(`#tblProyectos tr[id="${idregistro}"]`);
      if (row) {
        row.remove();
      }
      Swal.fire({
        title: "Éxito!",
        text: "Eliminación exitosa.",
        icon: "success",
        confirmButtonText: "Ok"
      });
    } else {
      Swal.fire({
        html: `
          <p class="d-inline-flex gap-1">
            <span>Error durante el proceso. Los cambios se han revertido.</span>
            <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
              <i class="bi bi-info-circle fs-5"></i>
            </button>
          </p>
          <div class="collapse" id="collapseExample">
            <div class="card card-body">
              ${response.message}
            </div>
          </div>
        `,
        title: "Error!",
        text: response.message,
        icon: "error",
        confirmButtonText: "Ok"
      });
    }
  })
  .catch(error => {
    console.error("Error en la solicitud AJAX:", error);
  });
});