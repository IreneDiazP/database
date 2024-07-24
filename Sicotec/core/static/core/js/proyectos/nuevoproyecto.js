document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("cboTipoEnFinanciamiento")
    .addEventListener("change", async function () {
      var entidadID = this.value;
      if (entidadID) {
        try {
          const response = await fetch(
            `/proyecto/getInstituciones/${entidadID}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`La respuesta de la red no fue correcta: ${response.statusText}`);
          }

          const data = await response.json();
          var cboInstituciones = document.getElementById(
            "cboTipoInsFinanciamiento"
          );
          cboInstituciones.innerHTML = "<option selected></option>";
          data.forEach(function (item) {
            var option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.cInstFinancia;
            cboInstituciones.appendChild(option);
          });
        } catch (error) {
          console.error(
            "Hubo un problema con la operación de búsqueda:",
            error
          );
        }
      } else {
        document.getElementById("cboTipoInsFinanciamiento").innerHTML = "";
      }
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

//click en el submit del formulario
document
  .getElementById("formAgregarProyecto")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const urlspost = "../../proyecto/registrarProyecto/";

    let tipo_proyec = document.getElementById("cboTipoProyecto").value;
    let cod_proyec = document.getElementById("txtCodigoProyecto").value;
    let nom_proyect = document.getElementById("txtNombreProyecto").value;
    let des_proyect = document.getElementById("txtDescripcion").value;
    let pais = document.getElementById("cboPais").value;
    let tipo_apoyo = document.getElementById("cboTipoApoyo").value;
    let entfinan = document.getElementById("cboTipoEnFinanciamiento").value;
    let instfinan = document.getElementById("cboTipoInsFinanciamiento").value;
    let tipo_moneda = document.getElementById("cboTipoMOneda").value;
    let monto = document.getElementById("txtMonto").value;
    let tipo_cambio = document.getElementById("txttipoCambio").value;
    let respIpen = document.getElementById("txtRespIpen").value;
    let respEnt = document.getElementById("txtRespEnt").value;
    let area_tem = document.getElementById("cboAreaTematica").value;
    let fechaIn = document.getElementById("txtFechaInicio").value;
    let fechaFin = document.getElementById("txtFechaFin").value;

    const csrftoken = getCookie("csrftoken");

    let data = {
      cboTipoProyecto: tipo_proyec,
      txtCodigoProyecto: cod_proyec,
      txtNombreProyecto: nom_proyect,
      txtDescripcion: des_proyect,
      cboPais: pais,
      cboTipoApoyo: tipo_apoyo,
      cboTipoEnFinanciamiento: entfinan,
      cboTipoInsFinanciamiento: instfinan,
      cboTipoMOneda: tipo_moneda,
      txtMonto: monto,
      txttipoCambio: tipo_cambio,
      txtRespIpen: respIpen,
      txtRespEnt: respEnt,
      cboAreaTematica: area_tem,
      txtFechaInicio: fechaIn,
      txtFechaFin: fechaFin,
    };
    fetch(urlspost, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        if (response.success) {
          limpiarCampos();

          NotificacionSwal("Éxito!", response.message, "success", "ok");
        } else {
          NotificacionSwal("Error!", response.message, "error", "ok");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud AJAX:", error);
        NotificacionSwal(
          "Error!",
          "Hubo un problema al procesar la solicitud",
          "error",
          "ok"
        );
      })
      .finally(() => {
        console.log("Terminó la petición");
      });
  });

function limpiarCampos() {
  const campos = [
    "cboTipoProyecto",
    "txtCodigoProyecto",
    "txtNombreProyecto",
    "txtDescripcion",
    "cboPais",
    "cboTipoApoyo",
    "cboTipoEnFinanciamiento",
    "cboTipoInsFinanciamiento",
    "cboTipoMOneda",
    "txtMonto",
    "txttipoCambio",
    "txtRespIpen",
    "txtRespEnt",
    "cboAreaTematica",
    "txtFechaInicio",
    "txtFechaFin",
  ];

  campos.forEach((campo) => {
    document.getElementById(campo).value = "";
  });
}

//EVENTO PARA CALCULAR TOTAL
document.getElementById("txtMonto").addEventListener("input", function () {
  let monto = this.value;
  console.log("el monto es :" + monto);
  let tipocambio = document.getElementById("txttipoCambio").value;

  total = monto * tipocambio;
  console.log("el total es " + total);
  document.getElementById("txtMontosoles").value = total;
});

document.getElementById("txttipoCambio").addEventListener("input", function () {
  let tipocambio = this.value;
  let monto = document.getElementById("txtMonto").value;

  total = monto * tipocambio;
  console.log("el total es " + total);
  document.getElementById("txtMontosoles").value = total;
});
