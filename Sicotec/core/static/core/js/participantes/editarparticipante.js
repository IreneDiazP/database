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

//para cambio de nombre o tipo de evento

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


//EVENTO CLICK EN AGREGAR EVENTO Y ESTE PINTA EN EL MODAL
document
  .getElementById("btnagregareventoparticipante")
  .addEventListener("click", async function () {
    TipoParticipante()
    idRegistroEvento = document.getElementById("cboTipoEventobuscar").value;
    contenedorbuscar = document.getElementById("opcionBuscarEvento");
    contenedorbuscar.classList.add("d-none");
    

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
          urlget
        );

        document.getElementById("cboTipoMOneda").value = data.cTipo_Moneda_id;
        document.getElementById("txtMonto").value = data.monto;
        document.getElementById("txttipoCambio").value = data.tipo_Cambio;
      }
    } catch (error) {
      NotificacionSwal(
        "Error!",
        "Hubo un problema al procesar la solicitud",
        "error",
        "ok"
      );
    }
  });

// Evento para cargar instituciones de financiamiento
document
  .getElementById("cboTipoEnFinanciamiento")
  .addEventListener("change", function () {
    const urlget = `/proyecto/getInstituciones/${this.value}`;
    cargarInstitucionesFinanciamiento(this.value, null, urlget);
  });



//click en boton SUBMIT GUARDAR EVENTO 
document
  .getElementById("formEditarañadirEvento")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    console.log("clickkkk en evento");

    idevento = document.getElementById("ideventousuario").value;
    idproyecto = document.getElementById('idproyectousuario').value
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
    Codigo_autorizacion = document.getElementById("txtCodigoAutorizacion").value;
    Codigo_acta = document.getElementById("txtCodigoActa").value;
    Compromiso = document.getElementById("txtCompromiso").value;
    Objetivo = document.getElementById("txtObjetivo").value;
    Informe = document.getElementById("txtInforme").value;
    Observacion = document.getElementById("txtObservacion").value;
    Actividad = document.getElementById("txtActividad").value;
    iddetalleeventoproyecto = document.getElementById('iddetalleeventoproyecto').value
    idparticipante=participanteidId

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
          let eventos = responseData.eventos
          console.log(eventos)

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
        const tablaBody = document.getElementById("tablaEventosBody");
        // Crea el HTML de la tabla
      let html = "";
      eventos.forEach(evento => {
        html += `
          <tr id="${evento.id}">
            <th class="text-center">${evento.codigoevento}</th>
            <th class="text-center">${evento.tipoevento}</th>
            <th class="text-center">${evento.nomEvento}</th>
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
                  data-bs-target="#modalEliminarEvento"
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

        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
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
  ];

  campos.forEach((campo) => {
    const element = document.getElementById(campo);
    if (element) {
      element.value = "";
    }
  });
}


//funcion para verificar si es experto o no 
function TipoParticipante() {
  let tipoparticipantee = document.getElementById('cboTipoParticipacion').value;
  console.log(tipoparticipantee);

  let tipoparticipante = tipoparticipantee.toUpperCase();
  let esExperto = tipoparticipante === "EXPERTO";

  const compromiso = document.getElementById('txtCompromiso');
  const informe = document.getElementById('txtInforme');
  const observacion = document.getElementById('txtObservacion');
  const actividad = document.getElementById('txtActividad');

  
  const compromisoContainer = compromiso.closest('.col-md-3');
  const informeContainer = informe.closest('.col-md-3');
  const observacionContainer = observacion.closest('.col-md-3');
  const actividadContainer = actividad.closest('.col-md-3');

  if (esExperto) {
    if (compromisoContainer) compromisoContainer.classList.add('d-none');
    if (informeContainer) informeContainer.classList.add('d-none');
  } else {
    if (observacionContainer) observacionContainer.classList.add('d-none');
    if (actividadContainer) actividadContainer.classList.add('d-none');
  }
}

