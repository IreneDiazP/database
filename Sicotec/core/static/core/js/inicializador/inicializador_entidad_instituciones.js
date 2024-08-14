// Función para cargar instituciones de financiamiento
async function cargarInstitucionesFinanciamiento(entidadID, selectedId = null, urlget,istrue) {
    if (entidadID) {
        try {
            const response = await fetch(urlget, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`La respuesta de la red no fue correcta: ${response.statusText}`);
            }
            if(istrue == 0){
                const data = await response.json();
                const cboInstituciones = document.getElementById("cboTipoInsFinanciamiento");
                cboInstituciones.innerHTML = "<option selected></option>";
    
                data.forEach(function (item) {
                    const option = document.createElement("option");
                    option.value = item.id;
                    option.textContent = item.cInstFinancia;
                    if (selectedId && selectedId == item.id) {
                        option.selected = true;
                    }
                    cboInstituciones.appendChild(option);
                });
            }else{
                const data = await response.json();
                const cboInstituciones = document.getElementById("cboTipoInsFinanciamientoP");
                cboInstituciones.innerHTML = "<option selected></option>";
    
                data.forEach(function (item) {
                    const option = document.createElement("option");
                    option.value = item.id;
                    option.textContent = item.cInstFinancia;
                    if (selectedId && selectedId == item.id) {
                        option.selected = true;
                    }
                    cboInstituciones.appendChild(option);
                });
            }

        } catch (error) {
            console.error("Hubo un problema con la operación de búsqueda:", error);
        }
    } else {
        document.getElementById("cboTipoInsFinanciamiento").innerHTML = "";
    }
}



