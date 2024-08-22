document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('formAgregarUsuario').addEventListener('submit',LimpiarCampos)
})

function LimpiarCampos(){
    const ids = ['txtNombres', 'txtApellidos', 'txtarea', 'txtEmail', 'txtUsername', 'txtContraseña'];
    ids.forEach(function(id) {
        const campo = document.getElementById(id);
        if (campo) {
            campo.value = '';  
        }
    });
}