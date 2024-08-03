document.addEventListener("DOMContentLoaded", function () {
  const tablaparticipante = document.getElementById("tblParticipantes");

  tablaparticipante.addEventListener("click", function (event) {
    console.log("click");
    const target = event.target;

    if (target.tagName === "TH") {
      let row = target.parentNode;

      if (row.tagName === "TR") {
        let rowId = row.id;
        console.log("ID de la fila:", rowId);

        window.location.href = `../../becario/editarparticipante/${rowId}/`;
      }
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

document
  .getElementById("GuardarCambios")
  .addEventListener("click", function () {
    let changes = [];

    document
      .querySelectorAll("#tblParticipantes tbody tr")
      .forEach(function (row) {
        let id = row.id;

        let tipoProcedencia = row.querySelector(
          'input[name="procedencia' + id + '"]:checked'
        )?.value;

        let estado = row.querySelector(
          'input[name="Estado_' + id + '"]:checked'
        )?.value;

        if (estado === "True") {
          estado = 1;
        } else if (estado === "False") {
          estado = 0;
        }

        if (tipoProcedencia || estado !== undefined) {
          changes.push({
            id: id,
            procedencia: tipoProcedencia,
            estado: estado,
          });
        }
      });

    console.log("Los cambios son:", JSON.stringify(changes));

    const csrftoken = getCookie("csrftoken");
    const urlspost = "../../becario/actualizarParticipante/";

    fetch(urlspost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ changes: changes }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {

          const tbody = document.querySelector("#tblParticipantes tbody");
          tbody.innerHTML = "";

        
          data.participantes.forEach((participante) => {
            const row = document.createElement("tr");
            row.id = participante.id;

            row.innerHTML = `
                 <th class="">
                     ${participante.apellPate_participante} ${
              participante.apellMate_participante
            } ${participante.nom_participante}
                 </th>
                 <th>
                     ${
                       participante.sede__institucion_financiamiento__cInstFinancia
                     }
                 </th>
                 <th class="text-center">
                     ${participante.tipo_participante}
                 </th>
                 <th class="text-center">
                     <div class="d-flex gap-2 justify-content-center">
                         <input type="radio" id="tipoParticipanteInterno${
                           participante.id
                         }" name="tipo_participante${
              participante.id
            }" value="INTERNO" ${
              participante.procedencia === "INTERNO" ? "checked" : ""
            }>
                         <label for="tipoParticipanteInterno${
                           participante.id
                         }">Interno</label>
                         
                         <input type="radio" id="tipoParticipanteExterno${
                           participante.id
                         }" name="tipo_participante${
              participante.id
            }" value="EXTERNO" ${
              participante.procedencia === "EXTERNO" ? "checked" : ""
            }>
                         <label for="tipoParticipanteExterno${
                           participante.id
                         }">Externo</label>
                     </div>
                 </th>
                 <th class="text-center">
                     <div class="d-flex gap-2 justify-content-center">
                         <input type="radio" id="estadoTrue_${
                           participante.id
                         }" name="Estado_${participante.id}" value="True" ${
              participante.estado ? "checked" : ""
            }>
                         <label for="estadoTrue_${
                           participante.id
                         }">Activo</label>
                         
                         <input type="radio" id="estadoFalse_${
                           participante.id
                         }" name="Estado_${participante.id}" value="False" ${
              !participante.estado ? "checked" : ""
            }>
                         <label for="estadoFalse_${
                           participante.id
                         }">Inactivo</label>
                     </div>
                 </th>
             `;

            tbody.appendChild(row);
          });

          NotificacionSwal(
            "Éxito!",
            "Cambios guardados exitosamente.",
            "success",
            "ok"
          );
        } else {
          NotificacionSwal("Error!", data.message, "error", "ok");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud :", error);
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
