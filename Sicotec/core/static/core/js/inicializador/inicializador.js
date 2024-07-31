document.addEventListener("DOMContentLoaded", function () {
    document
      .getElementById("cboTipoEnFinanciamiento")
      .addEventListener("change", async function () {
        var entidadID = this.value;
        if (entidadID) {
          try {
            const response = await fetch(
              `/proyecto/getInstituciones/${entidadID}/`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
  
            if (!response.ok) {
              throw new Error(`La respuesta de la red no fue correcta: ${response.statusText}`);
            }
  
            const data = await response.json();
            let cboInstituciones = document.getElementById(
              "cboTipoInsFinanciamiento"
            );
            cboInstituciones.innerHTML = "<option selected></option>";
            data.forEach(function (item) {
              let option = document.createElement("option");
              option.value = item.id;
              option.textContent = item.cInstFinancia;
              cboInstituciones.appendChild(option);
            });
          } catch (error) {
            console.error(
              "Hubo un problema con la operación de búsqueda:",
              error
            );
          }
        } else {
          document.getElementById("cboTipoInsFinanciamiento").innerHTML = "";
        }
      });
  });
  

  //EVENTO PARA CALCULAR TOTAL
document.getElementById("txtMonto").addEventListener("input", function () {
    let monto = this.value;
    console.log("el monto es :" + monto);
    let tipocambio = document.getElementById("txttipoCambio").value;
  
    total = monto * tipocambio;
    console.log("el total es " + total);
    document.getElementById("txtMontosoles").value = total;
  });
  
  document.getElementById("txttipoCambio").addEventListener("input", function () {
    let tipocambio = this.value;
    let monto = document.getElementById("txtMonto").value;
  
    total = monto * tipocambio;
    console.log("el total es " + total);
    document.getElementById("txtMontosoles").value = total;
  });
  