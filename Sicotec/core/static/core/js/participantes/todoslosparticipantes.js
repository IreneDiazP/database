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

        window.location.href = `../editarparticipante/`;
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



  document.getElementById("GuardarCambios").addEventListener("click", function () {
    let changes = [];
  
    document.querySelectorAll("#tblParticipantes tbody tr").forEach(function (row) {
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
  
    console.log('Los cambios son:', JSON.stringify(changes));
  
    const csrftoken = getCookie("csrftoken");
     const urlspost="../../becario/actualizarParticipante/"

    fetch(urlspost,{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken, 
        },
        body: JSON.stringify({changes:changes})
    }).then(response => response.json()).then(data =>{
        if (data.status === 'success') {

            NotificacionSwal("Éxito!", "Cambios guardados exitosamente.", "success", "ok");  
          } else {
            NotificacionSwal("Error!", data.message, "error", "ok");
          }
    }).catch((error) => {
        console.error("Error en la solicitud :", error);
        NotificacionSwal(
          "Error!",
          "Hubo un problema al procesar la solicitud",
          "error",
          "ok"
        );
    }).finally(()=>{
        console.log("Terminó la petición");
    })
  
  });
  