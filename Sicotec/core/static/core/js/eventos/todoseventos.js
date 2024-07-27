document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#tblEventos tbody")
    .addEventListener("click", async function (event) {
      if (
        event.target.classList.contains("editBtn") ||
        event.target.closest(".editBtn")
      ) {
        console.log('click en edit')
        let idRegistroEvento = event.target.closest("tr").getAttribute("id");
        document.getElementById("txtIdProyectoModalEditarEvento").value =
        idRegistroEvento;
        console.log("ID del proyecto:", idRegistroEvento);
        CargardatoEventos(idRegistroEvento);
      }
    });

//   document
//     .querySelector("#tblEventos  tbody")
//     .addEventListener("click", function (event) {
//       console.log("hola eliminar");
//       if (
//         event.target.classList.contains("trashBtn") ||
//         event.target.closest(".trashBtn")
//       ) {
//         console.log("comooo");
//         let idregistoeliminar = event.target.closest("tr").getAttribute("id");
//         console.log(idregistoeliminar);
//         document.getElementById("txtIdProyectoModalEliminarProyecto").value =
//           idregistoeliminar;
//       }
//     });
});

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

async function CargardatoEventos(idRegistroEvento) {
  const rutaeditar = `../../eventos/editarevento/${idRegistroEvento}`;
  document
    .getElementById("formEditarEvento")
    .setAttribute("action", rutaeditar);

  const url = `../../eventos/getDatosEvento/${idRegistroEvento}`;
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
      console.log("pedi los datos");
      console.log(result);

      document.getElementById("txtCodigoEvento").value =
        data.codigoEvento;
      document.getElementById("txtNombreEvento").value =
        data.nomEvento;
      document.getElementById("cboTipoEvento").value =
        data.cTipoEvento_id;
      document.getElementById("cboAreaTematica").value =
        data.cAreaTem_id;
      document.getElementById("txtDescripcion").value = data.DescEvento;
      document.getElementById("cboPais").value =
        data.cpais_id;
        document.getElementById("txtFechainicio").value =
        data.fechaInicio;
      document.getElementById("txtFechafin").value = data.fechaFin;
      document.getElementById("cboTipoApoyo").value =
        data.cTipoApoyo_id;

      document.getElementById("cboTipoEnFinanciamiento").value =
        data.cEntFinan_id;

      await cargarInstitucionesFinanciamiento(
        data.cEntFinan_id,
        data.cInstFinanc_id
      );

      document.getElementById("cboTipoMOneda").value =
        data.cTipo_Moneda_id;
      document.getElementById("txtMonto").value = data.monto;
      document.getElementById("txttipoCambio").value =
        data.tipo_Cambio;

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
