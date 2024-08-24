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



document.getElementById("formAgregarParticpante").addEventListener("submit", function(event){
    event.preventDefault()
    //capturamos el id del participante
    const url = window.location.pathname;
    const parts = url.split("/");
    participanteidId = parts[parts.length - 2];
    
    //traeremos los datos desde el formulario
    tipoparticipante=document.getElementById("cboTipoParticipacion").value
    procedencia=document.getElementById("cboTipoProcedencia").value
    nombreparticipante=document.getElementById("txtNombreParticpante").value
    apellidopaterno=document.getElementById("txtApellidoPaterno").value
    apellidomaterno=document.getElementById("txtApellidoMaterno").value
    correoelectronico=document.getElementById("txtCorreo").value
    tipodocumento=document.getElementById("cboTipoDocumento").value
    numerodocumento=document.getElementById("txtDocumento").value
    telefono=document.getElementById("txtTelefono").value
    formacionacademica=document.getElementById("cboTiformacionacademica").value
    pais=document.getElementById("cboPais").value
    ciudad=document.getElementById("txtCiudad").value
    departamento=document.getElementById("cboDepartamento").value
    provincia=document.getElementById("cboProvincia").value
    distrito=document.getElementById("cboDistrito").value
    institucion=document.getElementById("cdboInstitucion").value
    sede=document.getElementById("txtNombreSede").value
    direccion=document.getElementById("txtDireccionSede").value
    oficina=document.getElementById("txtOficinasede").value
    idsede=document.getElementById("idsede").value

    data = {
        tipoparticipante,
        procedencia,
        nombreparticipante,
        apellidopaterno,
        apellidomaterno,
        correoelectronico,
        tipodocumento,
        numerodocumento,
        telefono,
        formacionacademica,
        pais,
        ciudad,
        departamento,
        provincia,
        distrito,
        institucion,
        sede,
        direccion,
        oficina,
        idsede
    }
console.log('la data es')
console.log(data)
const urlmodificarparticipante = `../../modificarparticipante/${participanteidId}`;

const csrftoken = getCookie("csrftoken");

fetch(urlmodificarparticipante,{
    method:"POST",
    headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(data)
}).then((response) => response.json()).then((responsedata) =>{
    if(responsedata.success){
        NotificacionSwal("Éxito!", responsedata.message, "success", "ok");
        const data = responsedata.data;
        console.log('la data de participante')
        console.log(data)
        document.getElementById("cboTipoParticipacion").value = data.tipoparticipante;
        document.getElementById("cboTipoProcedencia").value = data.procedencia;
        document.getElementById("txtNombreParticpante").value = data.nombreparticipante;
        document.getElementById("txtApellidoPaterno").value = data.apellidopaterno;
        document.getElementById("txtApellidoMaterno").value = data.apellidomaterno;
        document.getElementById("txtCorreo").value = data.correoelectronico;
        document.getElementById("cboTipoDocumento").value = data.tipodocumento;
        document.getElementById("txtDocumento").value = data.numerodocumento;
        document.getElementById("txtTelefono").value = data.telefono;
        document.getElementById("cboTiformacionacademica").value = data.formacionacademica;
        document.getElementById("cboPais").value = data.pais;
        document.getElementById("txtCiudad").value = data.ciudad;
        document.getElementById("cboDepartamento").value = data.departamento;
        document.getElementById("cboProvincia").value = data.provincia;
        document.getElementById("cboDistrito").value = data.distrito;
        document.getElementById("cdboInstitucion").value = data.institucion;
        document.getElementById("txtNombreSede").value = data.sede;
        document.getElementById("txtDireccionSede").value = data.direccion;
        document.getElementById("txtOficinasede").value = data.oficina;
        document.getElementById("idsede").value = data.idsede
    }else{
        NotificacionSwal("Error!", responseData.message, "error", "ok");
    }
})


})