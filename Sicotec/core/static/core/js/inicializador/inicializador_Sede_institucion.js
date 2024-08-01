document.addEventListener("DOMContentLoaded",function(){
    document.getElementById("cdboInstitucion").addEventListener("change", async function(){
        
        const idinstitucion=this.value;
        
        limpiarcampos()
        if(idinstitucion){
            try {
                const response = await fetch(
                    `/becario/getSede/${idinstitucion}/`,
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
                    const cdboSede = document.getElementById('cdboSede');
                    
                    cdboSede.innerHTML = "<option selected></option>" +
                      data.map(item => `<option value="${item.id}">${item.nombre_sede}</option>`).join('');
                }
                
            } catch (error) {
                console.error(
                    "Hubo un problema con la operación de búsqueda:",
                    error
                  );
            }
        }else{
            document.getElementById("cdboSede").innerHTML = "";
        }

    })


    document.getElementById("cdboSede").addEventListener("change", async function(){
        const idsede=this.value;
        if(idsede){
            try {
                const response = await fetch(
                    `/becario/getdatosSede/${idsede}/`,
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
                    const { direccion, oficina } = await response.json();
                    document.getElementById('txtDireccionSede').value = direccion;
                    document.getElementById('txtOficinasede').value = oficina;

                    
                }
                
            } catch (error) {
                console.error(
                    "Hubo un problema con la operación de búsqueda:",
                    error
                  );
            }
        }else{
            document.getElementById("cdboSede").innerHTML = "";
        }

    })

function limpiarcampos(){
    document.getElementById('txtDireccionSede').value=''
    document.getElementById('txtOficinasede').value=''
}




})