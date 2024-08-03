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
            // document.getElementById('cboTipoDocumento').value = data.data.email;
            document.getElementById('txtDocumento').value = data.data.numero_documento;
            document.getElementById('txtTelefono').value = data.data.telefono;
            document.getElementById('cboTiformacionacademica').value = data.data.cFormacion_academica;
            document.getElementById('cboPais').value = data.data.cpais;
            document.getElementById('txtCiudad').value = data.data.ciudad;
            document.getElementById('cboDepartamento').value = data.data.cdepartamento;
            document.getElementById('cboProvincia').value = data.data.cprovincia;
            document.getElementById('cboDistrito').value = data.data.cdistrito;
            // document.getElementById('cdboInstitucion').value = data.data.email;
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
