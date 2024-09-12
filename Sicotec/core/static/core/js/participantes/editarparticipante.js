let participanteidId;

document.addEventListener("DOMContentLoaded", function () {
  const url = window.location.pathname;
  const parts = url.split("/");
  participanteidId = parts[parts.length - 2];

  const data = { participanteidId: participanteidId };

  console.log("participanteidId:", participanteidId);

  const csrftoken = getCookie("csrftoken");
  const urlsposttt = "/becario/getdatosparticipante/";

  //obtener datos del participante y rellenar en cada campo
  fetch(urlsposttt, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log("Datos de los participantes:", data);
        document.getElementById("cboTipoParticipacion").value =
          data.data.tipo_participante;
        document.getElementById("cboTipoProcedencia").value =
          data.data.procedencia;
        document.getElementById("txtNombreParticpante").value =
          data.data.nom_participante;
        document.getElementById("txtApellidoPaterno").value =
          data.data.apellPate_participante;
        document.getElementById("txtApellidoMaterno").value =
          data.data.apellMate_participante;
        document.getElementById("txtCorreo").value = data.data.email;
        document.getElementById("cboTipoDocumento").value =
          data.data.tipo_documento;
        document.getElementById("txtDocumento").value =
          data.data.numero_documento;
        document.getElementById("txtTelefono").value = data.data.telefono;
        document.getElementById("cboTiformacionacademica").value =
          data.data.cFormacion_academica;
        document.getElementById("cboPais").value = data.data.cpais;
        document.getElementById("txtCiudad").value = data.data.ciudad;

        actualizarVisibilidadCampos();
        // Cargar datos de departamento y provincia
        const departamentoId = data.data.cdepartamento;
        const provinciaId = data.data.cprovincia;

        if (departamentoId) {
          document.getElementById("cboDepartamento").value = departamentoId;
          // Cargar provincias basadas en el departamento
          fetch(`/becario/getProvincias/${departamentoId}/`)
            .then((response) => response.json())
            .then((provincias) => {
              const cboProvincia = document.getElementById("cboProvincia");
              cboProvincia.innerHTML =
                "<option selected></option>" +
                provincias
                  .map(
                    (item) =>
                      `<option value="${item.id}" ${
                        item.id === provinciaId ? "selected" : ""
                      }>${item.provincia}</option>`
                  )
                  .join("");
              if (provinciaId) {
                document.getElementById("cboProvincia").value = provinciaId;
                // Cargar distritos basados en la provincia
                fetch(`/becario/getDistrito/${provinciaId}/`)
                  .then((response) => response.json())
                  .then((distritos) => {
                    const cboDistrito = document.getElementById("cboDistrito");
                    cboDistrito.innerHTML =
                      "<option selected></option>" +
                      distritos
                        .map(
                          (item) =>
                            `<option value="${item.id}" ${
                              item.id === data.data.cdistrito ? "selected" : ""
                            }>${item.distrito}</option>`
                        )
                        .join("");
                  });
              }
            });
        } else {
          document.getElementById("cboProvincia").innerHTML = "";
          document.getElementById("cboDistrito").innerHTML = "";
        }

        // Cargar datos de sede
        if (data.data.sede) {
          document.getElementById("idsede").value =
            data.data.sede.idparticipantesede;
          document.getElementById("cdboInstitucion").value =
            data.data.sede.institucion_financiamiento;
          document.getElementById("txtNombreSede").value =
            data.data.sede.nombre_sede;
          document.getElementById("txtDireccionSede").value =
            data.data.sede.direccion_sede;
          document.getElementById("txtOficinasede").value =
            data.data.sede.oficina_sede;
        }
      } else {
        console.error("Error:", data.message);
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

//VISIBILIDAD CUANDO ELIGE PERU U OTRO PAIS PARA DEPARTAMENTO
function actualizarVisibilidadCampos() {
  const cboPais = document.getElementById("cboPais");
  const paisSeleccionadoNombre =
    cboPais.options[cboPais.selectedIndex].textContent.toUpperCase();
  let inputciudad = document.getElementById("inputciudad");
  let inputdepartamento = document.getElementById("inputdepartamento");
  let inputprovincia = document.getElementById("inputprovincia");
  let inputdistrito = document.getElementById("inputdistrito");

  if (paisSeleccionadoNombre === "PERU" || paisSeleccionadoNombre === "PERÚ") {
    inputdepartamento.classList.remove("d-none");
    inputprovincia.classList.remove("d-none");
    inputdistrito.classList.remove("d-none");
    inputciudad.classList.add("d-none");
  } else {
    inputciudad.classList.remove("d-none");
    inputdepartamento.classList.add("d-none");
    inputprovincia.classList.add("d-none");
    inputdistrito.classList.add("d-none");
  }
}

//ESCUCHAR CAMBIOS CUANDO HACE CAMBIO EN PERU PARA MOSTRAR CIUDAD O DEPARTAMENTOS
document.getElementById("cboPais").addEventListener("change", function () {
  const { value, textContent } = this.options[this.selectedIndex];
  const paisSeleccionadoNombre = textContent.toUpperCase();
  let inputciudad = document.getElementById("inputciudad");
  let inputdepartamento = document.getElementById("inputdepartamento");
  let inputprovincia = document.getElementById("inputprovincia");
  let inputdistrito = document.getElementById("inputdistrito");

  if (paisSeleccionadoNombre === "PERU" || paisSeleccionadoNombre === "PERÚ") {
    inputdepartamento.classList.remove("d-none");
    inputprovincia.classList.remove("d-none");
    inputdistrito.classList.remove("d-none");
    inputciudad.classList.add("d-none");
    document.getElementById("txtCiudad").value = "";
  } else {
    inputciudad.classList.remove("d-none");
    inputdepartamento.classList.add("d-none");
    inputprovincia.classList.add("d-none");
    inputdistrito.classList.add("d-none");

    document.getElementById("cboDepartamento").value = "";
    document.getElementById("cboProvincia").value = "";
    document.getElementById("cboDistrito").value = "";
  }
});

//para cambio de nombre o tipo de EVENTO
const cboTipoEventoCodigo = document.getElementById("cboTipoEventobuscar");
const cboEventoNombre = document.getElementById("cboNombreeventobuscar");

cboTipoEventoCodigo.addEventListener("change", function () {
  idvalortipo = this.value;
  cboEventoNombre.value = idvalortipo;
});

cboEventoNombre.addEventListener("change", function () {
  idvalornombre = this.value;
  cboTipoEventoCodigo.value = idvalornombre;
});

//FUNCION PARA  OBTENER VARIABLES
function obtenerValorocultar() {
  const compromiso = document.getElementById("txtCompromiso");
  const informe = document.getElementById("txtInforme");
  const observacion = document.getElementById("txtObservacion");
  const actividad = document.getElementById("txtActividad");

  TipoParticipante(compromiso, informe, observacion, actividad);
}

//EVENTO CLICK EN AGREGAR EVENTO Y ESTE PINTA EN EL MODAL
document
  .getElementById("btnagregareventoparticipante")
  .addEventListener("click", async function () {
    contenedorbuscar = document.getElementById("opcionBuscarEvento");
    contenedorbuscar.classList.add("d-none");
    obtenerValorocultar();

    idRegistroEvento = document.getElementById("cboTipoEventobuscar").value;

    const urleventos = `../../getDatosEvento/${idRegistroEvento}`;

    const csrftoken = getCookie("csrftoken");
    try {
      const response = await fetch(urleventos, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": csrftoken,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        Limpiarcamposbutton();
        NotificacionSwal("Error!", errorData.message, "error", "ok");
      } else {
        const result = await response.json();
        const data = result.data;
        console.log("los datos para evento");
        console.log(data);
        document.getElementById("txtCodigoEvento").value = data.codigoEvento;
        document.getElementById("ideventousuario").value = data.idevento;
        document.getElementById("txtNombreEvento").value = data.nomEvento;
        document.getElementById("cboTipoEvento").value = data.cTipoEvento_id;
        document.getElementById("cboAreaTematica").value = data.cAreaTem_id;
        document.getElementById("txtDescripcion").value = data.DescEvento;
        document.getElementById("cboPaiss").value = data.cpais_id;
        console.log(
          (document.getElementById("cboPaiss").value = data.cpais_id)
        );
        document.getElementById("txtFechainicio").value = data.fechaInicio;
        document.getElementById("txtFechafin").value = data.fechaFin;
        document.getElementById("cboTipoApoyo").value = data.cTipoApoyo_id;

        document.getElementById("cboTipoEnFinanciamiento").value =
          data.cEntFinan_id;

        const urlget = `/proyecto/getInstituciones/${data.cEntFinan_id}`;
        await cargarInstitucionesFinanciamiento(
          data.cEntFinan_id,
          data.cInstFinanc_id,
          urlget,
          0
        );
        document.getElementById("txtRespIpenn").value = data.responsableIpen;
        document.getElementById("txtRespEntt").value = data.responsableentidad;

        document.getElementById("cboTipoMOneda").value = data.cTipo_Moneda_id;
        document.getElementById("txtMonto").value = data.monto;
        document.getElementById("txttipoCambio").value = data.tipo_Cambio;
        let monto = parseFloat(data.monto);
        let tipoCambio = parseFloat(data.tipo_Cambio);
        let montoEnSoles = monto * tipoCambio;
        document.getElementById("txtMontosoles").value = isNaN(montoEnSoles)
          ? ""
          : formatDecimal(montoEnSoles);
      }
    } catch (error) {
      Limpiarcamposbutton();
      NotificacionSwal(
        "Error!",
        "Hubo un problema al procesar la solicitud por favor selecciona una opción",
        "error",
        "ok"
      );
    }
  });

function Limpiarcamposbutton() {
  console.log("limpiar campos");
  const contenedorbuscar = document.getElementById("opcionBuscarEvento");
  contenedorbuscar.classList.remove("d-none");
  limpiarCampos();
}

// Añade el event listener a los botones
document
  .getElementById("botoncancelareventoparticipante")
  .addEventListener("click", Limpiarcamposbutton);
document
  .getElementById("closebuttoneventoparticipante")
  .addEventListener("click", Limpiarcamposbutton);

// Evento para cargar instituciones de financiamiento
document
  .getElementById("cboTipoEnFinanciamiento")
  .addEventListener("change", function () {
    const urlget = `/proyecto/getInstituciones/${this.value}`;
    cargarInstitucionesFinanciamiento(this.value, null, urlget, 0);
  });

//click en boton SUBMIT GUARDAR EVENTO
document
  .getElementById("formEditarañadirEvento")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    idevento = document.getElementById("ideventousuario").value;
    idproyecto = document.getElementById("idproyectousuario").value;
    CodigoEvento = document.getElementById("txtCodigoEvento").value;
    NombreEvento = document.getElementById("txtNombreEvento").value;
    TipoEvento = document.getElementById("cboTipoEvento").value;
    AreaTematica = document.getElementById("cboAreaTematica").value;
    DescripcionEvento = document.getElementById("txtDescripcion").value;
    PaisEvento = document.getElementById("cboPaiss").value;
    Fechainicio = document.getElementById("txtFechainicio").value;
    Fechafin = document.getElementById("txtFechafin").value;
    TipoApoyo = document.getElementById("cboTipoApoyo").value;
    TipoEnFinanciamiento = document.getElementById(
      "cboTipoEnFinanciamiento"
    ).value;
    TipoInsFinanciamiento = document.getElementById(
      "cboTipoInsFinanciamiento"
    ).value;
    TipoMOneda = document.getElementById("cboTipoMOneda").value;
    Monto = document.getElementById("txtMonto").value;
    TipoCambio = document.getElementById("txttipoCambio").value;
    Codigo_autorizacion = document.getElementById(
      "txtCodigoAutorizacion"
    ).value;
    Codigo_acta = document.getElementById("txtCodigoActa").value;
    Compromiso = document.getElementById("txtCompromiso").value;
    Objetivo = document.getElementById("txtObjetivo").value;
    Informe = document.getElementById("txtInforme").value;
    Observacion = document.getElementById("txtObservacion").value;
    Actividad = document.getElementById("txtActividad").value;
    iddetalleeventoproyecto = document.getElementById(
      "iddetalleeventoproyecto"
    ).value;
    responsableipen = document.getElementById("txtRespIpenn").value;
    responsableentidad = document.getElementById("txtRespEntt").value;
    let idparticipante = participanteidId;

    data = {
      idevento,
      idproyecto,
      CodigoEvento,
      NombreEvento,
      TipoEvento,
      AreaTematica,
      DescripcionEvento,
      PaisEvento,
      Fechainicio,
      Fechafin,
      TipoApoyo,
      TipoEnFinanciamiento,
      TipoInsFinanciamiento,
      TipoMOneda,
      Monto,
      TipoCambio,
      Codigo_autorizacion,
      Codigo_acta,
      Compromiso,
      Objetivo,
      Informe,
      Observacion,
      Actividad,
      idparticipante,
      iddetalleeventoproyecto,
      responsableipen,
      responsableentidad,
    };

    urleditarevento = "../../añadireventoproyecto/";
    const csrftoken = getCookie("csrftoken");
    fetch(urleditarevento, {
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
          console.log("listo envie todo");
          let eventos = responseData.eventos;
          console.log(eventos);

          contenedorbuscar = document.getElementById("opcionBuscarEvento");
          contenedorbuscar.classList.remove("d-none");

          const modalElement = document.getElementById(
            "modalEditarParticipantes"
          );

          const modal = bootstrap.Modal.getInstance(modalElement);

          limpiarCampos();

          if (modal) {
            modal.hide();
          }

          //para crear la tabla
          const tablaBody = document.querySelector(
            "#tblParticipantesEventos tbody"
          );
          // Crea el HTML de la tabla
          let html = "";
          eventos.forEach((evento) => {
            html += `
          <tr id="${evento.id}">
            <th class="text-center">${evento.codigoevento}</th>
            <th class="text-center">${evento.tipoevento}</th>
            <th class="text-center">${evento.nombrevento}</th>
            <th class="text-center">
              <div class="d-flex gap-2 justify-content-center">
                <button
                  type="button"
                  class="btn btn-success editBtn"
                  data-bs-toggle="modal"
                  data-bs-target="#modalEditarParticipantes"
                  data-bs-whatever="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-danger trashBtn"
                  data-bs-toggle="modal"
                  data-bs-target="#modalEliminarEventoParticipante"
                  data-bs-whatever="Eliminar"
                  >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </th>
          </tr>
        `;
          });

          // Asigna el HTML generado al tbody
          tablaBody.innerHTML = html;
          NotificacionSwal("Éxito!", responseData.message, "success", "ok");
        } else {
          NotificacionSwal("Error!", responseData.message, "error", "ok");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        NotificacionSwal(
          "Error!",
          "Ocurrió un problema con la solicitud.",
          "error",
          "ok"
        );
      });
  });

function limpiarCampos() {
  const campos = [
    "ideventousuario",
    "txtCodigoEvento",
    "txtNombreEvento",
    "cboTipoEvento",
    "cboAreaTematica",
    "txtDescripcion",
    "cboPaiss",
    "txtFechainicio",
    "txtFechafin",
    "cboTipoApoyo",
    "cboTipoEnFinanciamiento",
    "cboTipoInsFinanciamiento",
    "cboTipoMOneda",
    "txtMonto",
    "txttipoCambio",
    "cboTipoEventobuscar",
    "cboNombreeventobuscar",
    "txtCodigoAutorizacion",
    "txtCodigoActa",
    "txtCompromiso",
    "txtObjetivo",
    "txtInforme",
    "txtObservacion",
    "txtActividad",
    "txtRespEntt",
    "txtRespIpenn",
    "txtMontosoles",
  ];

  campos.forEach((campo) => {
    const element = document.getElementById(campo);
    if (element) {
      element.value = "";
    }
  });
}

//funcion para verificar si es experto o no

function TipoParticipante(compromiso, informe, observacion, actividad) {
  let tipoparticipantee = document.getElementById("cboTipoParticipacion").value;
  console.log(tipoparticipantee);

  let tipoparticipante = tipoparticipantee.toUpperCase();
  let esExperto = tipoparticipante === "EXPERTO";

  const compromisoContainer = compromiso.closest(".col-md-3");
  const informeContainer = informe.closest(".col-md-3");
  const observacionContainer = observacion.closest(".col-md-3");
  const actividadContainer = actividad.closest(".col-md-3");

  if (esExperto) {
    if (compromisoContainer) compromisoContainer.classList.add("d-none");
    if (informeContainer) informeContainer.classList.add("d-none");
  } else {
    if (observacionContainer) observacionContainer.classList.add("d-none");
    if (actividadContainer) actividadContainer.classList.add("d-none");
  }
}

//clic en editar evento agregado
document
  .querySelector("#tblParticipantesEventos tbody")
  .addEventListener("click", async function (event) {
    // Verifica si el clic se realizó en un botón de edición
    if (
      event.target.classList.contains("editBtn") ||
      event.target.closest(".editBtn")
    ) {
      const row = event.target.closest("tr");
      const rowId = row.id;
      console.log("ID de la fila:", rowId);

      document.getElementById("opcionBuscarEvento").classList.add("d-none");

      obtenerValorocultar();

      const csrftoken = getCookie("csrftoken");

      const urlgetevento = `../../editareventoparticipante/${rowId}/${participanteidId}/`;
      console.log(urlgetevento);
      try {
        const response = await fetch(urlgetevento, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
        });

        const responsedata = await response.json();

        if (responsedata.success) {
          console.log("Datos del evento:", responsedata.eventoparticipante);

          const data = responsedata.eventoparticipante;
          document.getElementById("txtCodigoEvento").value = data.codigoevento;
          document.getElementById("txtNombreEvento").value = data.nombrevento;
          document.getElementById("cboTipoEvento").value = data.tipoevento;
          document.getElementById("cboAreaTematica").value = data.areatematica;
          document.getElementById("txtDescripcion").value = data.descripcion;
          document.getElementById("cboPaiss").value = data.pais;
          document.getElementById("txtFechainicio").value = data.fechainicio;
          document.getElementById("txtFechafin").value = data.fechafin;
          document.getElementById("cboTipoApoyo").value = data.tipoapoyo;
          document.getElementById("cboTipoEnFinanciamiento").value =
            data.entidadfinanciamiento;

          const urlget = `/proyecto/getInstituciones/${data.entidadfinanciamiento}`;
          cargarInstitucionesFinanciamiento(
            data.entidadfinanciamiento,
            data.institucionfinanciamiento,
            urlget,
            0
          );

          document.getElementById("cboTipoMOneda").value = data.tipomoneda;
          document.getElementById("txtMonto").value = formatDecimal(
            parseFloat(data.monto)
          );
          document.getElementById("txttipoCambio").value = formatDecimal(
            parseFloat(data.tipocambio)
          );

          let monto = parseFloat(data.monto);
          let tipoCambio = parseFloat(data.tipocambio);
          let montoEnSoles = monto * tipoCambio;
          document.getElementById("txtMontosoles").value = isNaN(montoEnSoles)
            ? ""
            : formatDecimal(montoEnSoles);

          document.getElementById("txtCodigoAutorizacion").value =
            data.codigoautorizacion;
          document.getElementById("txtCodigoActa").value = data.codigoacta;
          document.getElementById("txtCompromiso").value = data.compromiso;
          document.getElementById("txtObjetivo").value = data.objetivo;
          document.getElementById("txtInforme").value = data.informe;
          document.getElementById("txtObservacion").value = data.observacion;
          document.getElementById("txtActividad").value = data.actividad;
          document.getElementById("ideventousuario").value = data.idevento;
          document.getElementById("txtRespIpenn").value = data.responsableIpen;
          document.getElementById("txtRespEntt").value =
            data.responsableentidad;
          document.getElementById("iddetalleeventoproyecto").value =
            data.iddetalle;
        } else {
          console.log("Error:", responsedata.message);
        }
      } catch (error) {
        console.log("Error en la solicitud:", error);
      }
    }
  });

function formatDecimal(value) {
  let numericValue = parseFloat(value);
  if (isNaN(numericValue)) {
    return "";
  }

  let formattedValue = numericValue.toString();
  formattedValue = formattedValue.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, "$1");
  return formattedValue;
}

// Manejar clic en el botón de eliminar en la tabla
document
  .querySelector("#tblParticipantesEventos tbody")
  .addEventListener("click", function (event) {
    if (
      event.target.classList.contains("trashBtn") ||
      event.target.closest(".trashBtn")
    ) {
      let idRegistroEliminar = event.target.closest("tr").getAttribute("id");
      document.getElementById("txtIdProyectoModalEliminarEventoParti").value =
        idRegistroEliminar;
      console.log("El id para eliminar: " + idRegistroEliminar);
    }
  });

// Manejar el envío del formulario de eliminación
document
  .getElementById("formEliminarProyecto")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const idRegistro = document.getElementById(
      "txtIdProyectoModalEliminarEventoParti"
    ).value;
    const csrftoken = getCookie("csrftoken");

    // Ocultar el modal
    const modalElement = document.getElementById(
      "modalEliminarEventoParticipante"
    );
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }
    modalInstance.hide();

    // Datos a enviar
    const data = {
      idevento: idRegistro,
      idparticipante: participanteidId, // Asegúrate de que participanteidId esté definido
    };

    fetch("../../eliminareventoparticipante/", {
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
            `#tblParticipantesEventos tr[id="${idRegistro}"]`
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

// *****************************************************************************************
//para cambio de nombre o tipo de evento

const cboTipoProyectobuscar = document.getElementById("cboTipoProyectobuscar");
const cboNombreProyectobuscar = document.getElementById(
  "cboNombreProyectobuscar"
);

cboTipoProyectobuscar.addEventListener("change", function () {
  idvalortipo = this.value;
  cboNombreProyectobuscar.value = idvalortipo;
});

cboNombreProyectobuscar.addEventListener("change", function () {
  idvalornombre = this.value;
  cboTipoProyectobuscar.value = idvalornombre;
});

//FUNCION PARA  OBTENER VARIABLES
function obtenerValorocultarProyecto() {
  const compromiso = document.getElementById("txtCompromisop");
  const informe = document.getElementById("txtInformep");
  const observacion = document.getElementById("txtObservacionp");
  const actividad = document.getElementById("txtActividadp");

  TipoParticipante(compromiso, informe, observacion, actividad);
}

//BOTON AGREGAR PROYECTO
document
  .getElementById("btnagregarproyectoparticipante")
  .addEventListener("click", async function () {
    contenedorbuscar = document.getElementById("opcionBuscarProyecto");
    contenedorbuscar.classList.add("d-none");
    obtenerValorocultarProyecto();

    //obtenemos el id del proyecto que vamos buscar
    const idproyectobuscar = document.getElementById(
      "cboTipoProyectobuscar"
    ).value;

    console.log("el id del proyecto es: " + idproyectobuscar);

    const urlproyecto = `../../getProyectoParticipante/${idproyectobuscar}`;

    const csrftoken = getCookie("csrftoken");
    try {
      const response = await fetch(urlproyecto, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRFToken": csrftoken,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        LimpiarcamposProyectobutton();
        NotificacionSwal("Error!", errorData.message, "error", "ok");
      } else {
        const result = await response.json();
        const data = result.data;
        console.log("los datos para proyecto");
        console.log(result);
        console.log(data);

        document.getElementById("cboTipoProyecto").value = data.TipoProyecto;
        document.getElementById("txtCodigoProyecto").value =
          data.CodigoProyecto;
        document.getElementById("txtNombreProyecto").value =
          data.NombreProyecto;
        document.getElementById("txtDescripcionP").value = data.DescProyecto;
        document.getElementById("cboPaisP").value = data.PaisProyecto;
        document.getElementById("cboTipoApoyoP").value = data.TipoApoyo;
        document.getElementById("cboTipoEnFinanciamientoP").value =
          data.EntidadFina;
        document.getElementById("cboTipoMOnedaP").value = data.TipoMoneda;
        document.getElementById("txtidMontop").value = formatDecimal(
          parseFloat(data.monto)
        );
        document.getElementById("txtidtCambioP").value = formatDecimal(
          parseFloat(data.TipoCambio)
        );
        let monto = parseFloat(data.monto);
        let tipoCambio = parseFloat(data.tipo_Cambio);
        let montoEnSoles = monto * tipoCambio;
        document.getElementById("txtMontosolesP").value = isNaN(montoEnSoles)
          ? ""
          : formatDecimal(montoEnSoles);
        document.getElementById("txtRespIpen").value = data.Responsable;
        document.getElementById("txtRespEnt").value = data.ResponsableEntidad;
        document.getElementById("cboAreaTematicaP").value = data.AreaTematica;

        const urlget = `/proyecto/getInstituciones/${data.EntidadFina}`;
        await cargarInstitucionesFinanciamiento(
          data.EntidadFina,
          data.InstittucionFina,
          urlget,
          1
        );

        document.getElementById("txtFechaInicioP").value =
          data.FechaInicio || "";
        document.getElementById("txtFechaFinP").value = data.FechaFin || "";
        document.getElementById("txtIdProyectoModalEditarProyecto").value =
          data.idproyecto;
      }
    } catch (error) {
      LimpiarcamposProyectobutton();
      NotificacionSwal(
        "Error!",
        "Hubo un problema al procesar la solicitud por favor selecciona una opción!!!",
        "error",
        "ok"
      );
    }
  });

function LimpiarcamposProyectobutton() {
  console.log("limpiar campos");
  const contenedorbuscar = document.getElementById("opcionBuscarProyecto");
  contenedorbuscar.classList.remove("d-none");
  limpiarCamposProyectos();
}

// Añade el event listener a los botones
document
  .getElementById("botoncancelarProyectoparticipante")
  .addEventListener("click", LimpiarcamposProyectobutton);
document
  .getElementById("closebuttonProyectoparticipante")
  .addEventListener("click", LimpiarcamposProyectobutton);

// Evento para cargar instituciones de financiamiento
document
  .getElementById("cboTipoEnFinanciamientoP")
  .addEventListener("change", function () {
    const urlget = `/proyecto/getInstituciones/${this.value}`;
    cargarInstitucionesFinanciamiento(this.value, null, urlget, 1);
  });

function limpiarCamposProyectos() {
  const campos = [
    "cboTipoProyectobuscar",
    "cboNombreProyectobuscar",
    "cboTipoProyecto",
    "txtCodigoProyecto",
    "txtNombreProyecto",
    "txtDescripcionP",
    "cboPaisP",
    "cboTipoApoyoP",
    "cboTipoEnFinanciamientoP",
    "cboTipoInsFinanciamientoP",
    "cboTipoMOnedaP",
    "txtidMontop",
    "txtidtCambioP",
    "txtMontosolesP",
    "txtRespIpen",
    "txtRespEnt",
    "cboAreaTematicaP",
    "txtFechaInicioP",
    "txtFechaFinP",
    "txtCodigoAutorizacionp",
    "txtCodigoActap",
    "txtCompromisop",
    "txtObjetivop",
    "txtInformep",
    "txtObservacionp",
    "txtActividadp",
  ];

  campos.forEach((campo) => {
    const element = document.getElementById(campo);
    if (element) {
      element.value = "";
    }
  });
}

document
  .getElementById("formEditarProyecto")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const tipoProyecto = document.getElementById("cboTipoProyecto").value;
    const CodigoProyecto = document.getElementById("txtCodigoProyecto").value;
    const NombreProyecto = document.getElementById("txtNombreProyecto").value;
    const descripcionProyecto =
      document.getElementById("txtDescripcionP").value;
    const pais = document.getElementById("cboPaisP").value;
    const tipoApoyo = document.getElementById("cboTipoApoyoP").value;
    const tipoFinanciamiento = document.getElementById(
      "cboTipoEnFinanciamientoP"
    ).value;
    const InstittucionFinanciamiento = document.getElementById(
      "cboTipoInsFinanciamientoP"
    ).value;
    const tipoMoneda = document.getElementById("cboTipoMOnedaP").value;
    const Monto = document.getElementById("txtidMontop").value;
    const TipoCambio = document.getElementById("txtidtCambioP").value;
    const responsableIpen = document.getElementById("txtRespIpen").value;
    const responsableEntidad = document.getElementById("txtRespEnt").value;
    const areaTematica = document.getElementById("cboAreaTematicaP").value;
    const fechaInicio = document.getElementById("txtFechaInicioP").value;
    const fechaFin = document.getElementById("txtFechaFinP").value;
    const codigoautorizacion = document.getElementById(
      "txtCodigoAutorizacionp"
    ).value;
    const codigoActa = document.getElementById("txtCodigoActap").value;
    const compromiso = document.getElementById("txtCompromisop").value;
    const objetivo = document.getElementById("txtObjetivop").value;
    const informe = document.getElementById("txtInformep").value;
    const observacion = document.getElementById("txtObservacionp").value;
    const actividad = document.getElementById("txtActividadp").value;
    const idproyecto = document.getElementById(
      "txtIdProyectoModalEditarProyecto"
    ).value;
    const iddetalleproyecto = document.getElementById(
      "iddetalleproyectoparticipoante"
    ).value;

    let idparticipante = participanteidId;
    const data = {
      tipoProyecto,
      CodigoProyecto,
      NombreProyecto,
      descripcionProyecto,
      pais,
      tipoApoyo,
      tipoFinanciamiento,
      InstittucionFinanciamiento,
      tipoMoneda,
      Monto,
      TipoCambio,
      responsableIpen,
      responsableEntidad,
      areaTematica,
      fechaInicio,
      fechaFin,
      codigoautorizacion,
      codigoActa,
      compromiso,
      objetivo,
      informe,
      observacion,
      actividad,
      idparticipante,
      idproyecto,
      iddetalleproyecto,
    };
    console.log("La data es:", data);
    urlenviarproyecto = "../../añadirproyectoparticipante/";
    const csrftoken = getCookie("csrftoken");
    fetch(urlenviarproyecto, {
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
          console.log("la data es:");
          console.log(response.data);
          let proyectos = response.data;
          contenedorbuscar = document.getElementById("opcionBuscarEvento");
          contenedorbuscar.classList.remove("d-none");
          const modalElement = document.getElementById("modalEditarProyecto");
          const modal = bootstrap.Modal.getInstance(modalElement);
          LimpiarcamposProyectobutton();
          if (modal) {
            modal.hide();
          }

          const tablaBody = document.querySelector("#tblProyectos tbody");
          let html = "";
          proyectos.forEach((pr) => {
            html += `
      <tr id="${pr.id}">
      <th class="text-center">${pr.codigoProyecto} </th>
      <th>${pr.nomProyecto} </th>
      <th class="text-center">${pr.responsableEnt}</th>
      <th class="text-center">${pr.cAreaTem}</th>
      <th class="text-center">${pr.fechaInicio}</th>
      <th class="text-center">${pr.fechaFin}</th>
      <th class="text-center">
        <div class="d-flex gap-2 justify-content-center">
          <button type="button" class="btn btn-success editBtn" data-bs-toggle="modal"
            data-bs-target="#modalEditarProyecto" data-bs-whatever="Editar">
            <i class="bi bi-pencil"></i>
          </button>
          <button type="button" class="btn btn-danger trashBtn" data-bs-toggle="modal"
            data-bs-target="#modalEliminarProyecto" data-bs-whatever="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </th>
    </tr>
    `;
          });
          tablaBody.innerHTML = html;

          NotificacionSwal("Éxito!", response.message, "success", "ok");
        } else {
          NotificacionSwal("Error!", response.message, "error", "ok");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        NotificacionSwal(
          "Error!",
          "Ocurrió un problema con la solicitud.",
          "error",
          "ok"
        );
      });
  });

//CLICK EN EL BUTTON EDITAR
document
  .querySelector("#tblProyectos tbody")
  .addEventListener("click", async function (event) {
    // Verifica si el clic se realizó en un botón de edición
    if (
      event.target.classList.contains("editBtn") ||
      event.target.closest(".editBtn")
    ) {
      const row = event.target.closest("tr");
      const rowId = row.id;
      console.log("ID de la fila:", rowId);

      document.getElementById("opcionBuscarProyecto").classList.add("d-none");

      obtenerValorocultarProyecto();

      const csrftoken = getCookie("csrftoken");

      console.log("llegue hasta arriba de url");

      const urlgetproyecto = `../../editarproyectoparticipante/${rowId}/${participanteidId}/`;

      console.log(urlgetproyecto);

      try {
        const response = await fetch(urlgetproyecto, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
        });

        const responsedata = await response.json();

        if (responsedata.success) {
          console.log("Datos del proyecto:", responsedata.proyectoparticipante);
          console.log(responsedata.proyectoparticipante);

          const data = responsedata.proyectoparticipante;

          document.getElementById("cboTipoProyecto").value = data.tipoProyecto;
          document.getElementById("txtCodigoProyecto").value =
            data.codigoProyecto;
          document.getElementById("txtNombreProyecto").value =
            data.nombreproyecto;
          document.getElementById("txtDescripcionP").value =
            data.descripcionProyecto;
          document.getElementById("cboPaisP").value = data.pais;
          document.getElementById("cboTipoApoyoP").value = data.tipoApoyo;
          document.getElementById("cboTipoEnFinanciamientoP").value =
            data.EntiFinanciamiento;
          document.getElementById("cboTipoMOnedaP").value = data.tipoMoneda;
          document.getElementById("txtidMontop").value = formatDecimal(
            parseFloat(data.monto)
          );
          document.getElementById("txtidtCambioP").value = formatDecimal(
            parseFloat(data.tipoCambio)
          );
          document.getElementById("txtRespIpen").value = data.ResponsableIpen;
          document.getElementById("txtRespEnt").value = data.Responsableentidad;
          document.getElementById("cboAreaTematicaP").value = data.areatematica;

          const urlget = `/proyecto/getInstituciones/${data.EntiFinanciamiento}`;
          await cargarInstitucionesFinanciamiento(
            data.EntiFinanciamiento,
            data.InstiFinanciamiento,
            urlget,
            1
          );

          document.getElementById("txtFechaInicioP").value = data.fechainicio;
          document.getElementById("txtFechaFinP").value = data.fechafin;
          document.getElementById("txtIdProyectoModalEditarProyecto").value =
            data.idproyecto;
          document.getElementById("txtCodigoAutorizacionp").value =
            data.codautorizacion;
          document.getElementById("txtCodigoActap").value = data.codigoacta;
          document.getElementById("txtCompromisop").value = data.compromiso;
          document.getElementById("txtObjetivop").value = data.objetivo;
          document.getElementById("txtInformep").value = data.informe;
          document.getElementById("txtObservacionp").value = data.observacion;
          document.getElementById("txtActividadp").value = data.actividad;
          document.getElementById("iddetalleproyectoparticipoante").value =
            data.iddetalleproyecto;
        } else {
          console.log("Error:", responsedata.message);
          NotificacionSwal("Error!", responsedata.message, "Error", "ok");
        }
      } catch (error) {
        NotificacionSwal("Error!", responsedata.message, "Error", "ok");
      }
    }
  });

// Manejar clic en el botón de eliminar en la tabla
document
  .querySelector("#tblProyectos tbody")
  .addEventListener("click", function (event) {
    if (
      event.target.classList.contains("trashBtn") ||
      event.target.closest(".trashBtn")
    ) {
      let idRegistroEliminar = event.target.closest("tr").getAttribute("id");
      document.getElementById("txtIdProyectoModalEliminarProyecto").value =
        idRegistroEliminar;
      console.log("El id para eliminar: " + idRegistroEliminar);
    }
  });

// Manejar el envío del formulario de eliminación
document
  .getElementById("formEliminarProyectodetalle")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const idRegistro = document.getElementById(
      "txtIdProyectoModalEliminarProyecto"
    ).value;
    const csrftoken = getCookie("csrftoken");

    // Ocultar el modal
    const modalElement = document.getElementById("modalEliminarProyecto");
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }
    modalInstance.hide();

    // Datos a enviar
    const data = {
      idproyecto: idRegistro,
      idparticipante: participanteidId,
    };

    fetch("../../eliminarproyectoparticipante/", {
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
            `#tblProyectos tr[id="${idRegistro}"]`
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

function verificarTipoMoneda(tipoMoneda, ids) {
  const tipo = tipoMoneda.toLowerCase();
  const esSoles = tipo === "soles";

  const tipoCambioInput = document.getElementById(ids.tipoCambio);
  const montoInput = document.getElementById(ids.monto);
  const montosolesInput = document.getElementById(ids.montosoles);

  tipoCambioInput.disabled = esSoles;
  tipoCambioInput.value = esSoles ? "1" : "";
  montoInput.value = "";
  montosolesInput.value = "";
}

function calcularTotal(ids) {
  const tipoMoneda = document.getElementById(ids.tipoMoneda).value;
  const esSoles = tipoMoneda.toLowerCase() === "soles";

  const monto = parseFloat(document.getElementById(ids.monto).value) || 0;
  const tipoCambio =
    parseFloat(document.getElementById(ids.tipoCambio).value) || 1;
  const total = esSoles ? monto : monto * tipoCambio;

  document.getElementById(ids.montosoles).value = total;
}

const config1 = {
  tipoMoneda: "cboTipoMOnedaP",
  tipoCambio: "txtidtCambioP",
  monto: "txtidMontop",
  montosoles: "txtMontosolesP",
};

const config2 = {
  tipoMoneda: "cboTipoMOneda",
  tipoCambio: "txttipoCambio",
  monto: "txtMonto",
  montosoles: "txtMontosoles",
};

document
  .getElementById(config1.tipoMoneda)
  .addEventListener("change", function () {
    verificarTipoMoneda(this.options[this.selectedIndex].text, config1);
    calcularTotal(config1); // Recalcular cuando se cambie el tipo de moneda
  });

document.getElementById(config1.monto).addEventListener("input", function () {
  calcularTotal(config1);
});

document
  .getElementById(config1.tipoCambio)
  .addEventListener("input", function () {
    calcularTotal(config1);
  });

document
  .getElementById(config2.tipoMoneda)
  .addEventListener("change", function () {
    verificarTipoMoneda(this.options[this.selectedIndex].text, config2);
    calcularTotal(config2);
  });

document.getElementById(config2.monto).addEventListener("input", function () {
  calcularTotal(config2);
});

document
  .getElementById(config2.tipoCambio)
  .addEventListener("input", function () {
    calcularTotal(config2);
  });
