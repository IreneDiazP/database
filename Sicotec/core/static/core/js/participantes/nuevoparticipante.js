console.log('hola participante');
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