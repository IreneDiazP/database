document.addEventListener("DOMContentLoaded",function(){
    document.getElementById("cboDepartamento").addEventListener("change", async function(){
        const departametoid=this.value;
        console.log(departametoid)
        if(departametoid){
            try {
                const response = await fetch(
                    `/becario/getProvincias/${departametoid}/`,
                    {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                        },  
                    }
                )
                if(!response.ok){
                    throw new Error(`La respuesta de la red no fue correcta: ${response.statusText}`);
                }else{
                    const data = await response.json();
                    const cboProvincia = document.getElementById('cboProvincia');
                    
                    cboProvincia.innerHTML = "<option selected></option>" +
                      data.map(item => `<option value="${item.id}">${item.provincia}</option>`).join('');
                }
                
            } catch (error) {
                console.error(
                    "Hubo un problema con la operación de búsqueda:",
                    error
                  );
            }
        }else{
            document.getElementById("cboTipoInsFinanciamiento").innerHTML = "";
        }

    })
})