document.addEventListener("DOMContentLoaded", function () {
    const url = window.location.pathname; 
    const parts = url.split('/'); 
    const participanteidId = parts[parts.length - 2]; 

    const data = { participanteidId: participanteidId };

    console.log("participanteidId:", participanteidId);

    const csrftoken = getCookie("csrftoken");
    const urlsposttt = "/becario/getdatosparticipante/";
    
    fetch(urlsposttt, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Datos de los participantes:', data);
            document.getElementById('cboTipoParticipacion').value = data.data.tipo_participante;
            document.getElementById('cboTipoProcedencia').value = data.data.procedencia;
            document.getElementById('txtNombreParticpante').value = data.data.nom_participante;
            document.getElementById('txtApellidoPaterno').value = data.data.apellPate_participante;
            document.getElementById('txtApellidoMaterno').value = data.data.apellMate_participante;
            document.getElementById('txtCorreo').value = data.data.email;
            document.getElementById('cboTipoDocumento').value = data.data.tipo_documento;
            document.getElementById('txtDocumento').value = data.data.numero_documento;
            document.getElementById('txtTelefono').value = data.data.telefono;
            document.getElementById('cboTiformacionacademica').value = data.data.cFormacion_academica;
            document.getElementById('cboPais').value = data.data.cpais;
            document.getElementById('txtCiudad').value = data.data.ciudad;
            document.getElementById('cboDepartamento').value = data.data.cdepartamento;
            document.getElementById('cboProvincia').value = data.data.cprovincia;
            document.getElementById('cboDistrito').value = data.data.cdistrito;
            document.getElementById('cdboInstitucion').value = data.data.sede.institucion_financiamiento ;
            document.getElementById('txtNombreSede').value = data.data.sede.nombre_sede ;
            document.getElementById('txtDireccionSede').value = data.data.sede.direccion_sede ;
            document.getElementById('txtOficinasede').value = data.data.sede.oficina_sede ;
            actualizarVisibilidadCampos();
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});

function actualizarVisibilidadCampos() {
    const cboPais = document.getElementById("cboPais");
    const paisSeleccionadoNombre = cboPais.options[cboPais.selectedIndex].textContent.toUpperCase();
    let inputciudad = document.getElementById('inputciudad');
    let inputdepartamento = document.getElementById('inputdepartamento');
    let inputprovincia = document.getElementById('inputprovincia');
    let inputdistrito = document.getElementById('inputdistrito');

    if (paisSeleccionadoNombre === 'PERU' || paisSeleccionadoNombre === 'PERÚ') {
        inputdepartamento.classList.remove('d-none');
        inputprovincia.classList.remove('d-none');
        inputdistrito.classList.remove('d-none');
        inputciudad.classList.add('d-none');
    } else {
        inputciudad.classList.remove('d-none');
        inputdepartamento.classList.add('d-none');
        inputprovincia.classList.add('d-none');
        inputdistrito.classList.add('d-none');
    }
}
