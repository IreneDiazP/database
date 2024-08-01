document.addEventListener("DOMContentLoaded", function() {
    // evento para ocultar o mostrar formularios
    document.getElementById("cboPais").addEventListener("change", function() {
        const { value, textContent } = this.options[this.selectedIndex];
        const paisSeleccionadoNombre = textContent.toUpperCase();
        let inputciudad=document.getElementById('inputciudad')
        let inputdepartamento=document.getElementById('inputdepartamento')
        let inputprovincia=document.getElementById('inputprovincia')
        let inputdistrito=document.getElementById('inputdistrito')

        if(paisSeleccionadoNombre ==='PERU' || paisSeleccionadoNombre ==='PERÚ'){
            inputdepartamento.classList.remove('d-none')
            inputprovincia.classList.remove('d-none')
            inputdistrito.classList.remove('d-none')
            inputciudad.classList.add('d-none')

        }else{
            inputciudad.classList.remove('d-none')
            inputdepartamento.classList.add('d-none')
            inputprovincia.classList.add('d-none')
            inputdistrito.classList.add('d-none')
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

//click en submit del formulario de participante
document.getElementById("formAgregarParticpante").addEventListener("submit",function(event){
    event.preventDefault()

    const urlspost="../../becario/registrarParticpante/"

    const csrftoken = getCookie("csrftoken");

    const data = {
        tipoParticipante: document.querySelector("#cboTipoParticipacion").value,
        procedencia: document.querySelector("#cboTipoProcedencia").value,
        nombres: document.querySelector("#txtNombreParticpante").value,
        apellidoPaterno: document.querySelector("#txtApellidoPaterno").value,
        apellidoMaterno: document.querySelector("#txtApellidoMaterno").value,
        email: document.querySelector("#txtCorreo").value,
        tipoDocumento: document.querySelector("#cboTipoDocumento").value,
        documento: document.querySelector("#txtDocumento").value,
        telefono: document.querySelector("#txtTelefono").value,
        formacionAcademica: document.querySelector("#cboTiformacionacademica").value,
        pais: document.querySelector("#cboPais").value,
        ciudad: document.querySelector("#txtCiudad").value,
        departamento: document.querySelector("#cboDepartamento").value,
        provincia: document.querySelector("#cboProvincia").value,
        distrito: document.querySelector("#cboDistrito").value,
        institucion: document.querySelector("#cdboInstitucion").value,
        sede: document.querySelector("#txtNombreSede").value,
        direccionSede: document.querySelector("#txtDireccionSede").value,
        doficina: document.querySelector("#txtOficinasede").value
    };
    
    console.log(data);

    fetch(urlspost,{
        method:"POST",
        headers:{
            "content-Type": "application/json",
            "X-CSRFToken": csrftoken, 
        },
        body: JSON.stringify(data),

    }).then((response) => response.json()).then((response) =>{
        if (response.success) {
            limpiarCampos();
  
            NotificacionSwal("Éxito!", response.message, "success", "ok");
          } else {
            NotificacionSwal("Error!", response.message, "error", "ok");
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
    

})


function limpiarCampos() {
    const campos = [
      "cboTipoParticipacion",
      "cboTipoProcedencia",
      "txtNombreParticpante",
      "txtApellidoPaterno",
      "txtApellidoMaterno",
      "txtCorreo",
      "cboTipoDocumento",
      "txtDocumento",
      "txtTelefono",
      "cboTiformacionacademica",
      "cboPais",
      "txtCiudad",
      "cboDepartamento",
      "cboProvincia",
      "cboDistrito",
      "cdboInstitucion",
      "txtNombreSede",
      "txtDireccionSede",
      "txtOficinasede",
    ];
  
    campos.forEach((campo) => {
      document.getElementById(campo).value = "";
    });
  }
  