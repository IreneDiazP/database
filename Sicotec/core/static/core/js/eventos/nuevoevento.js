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

//click en el submit del formulario
document.getElementById("formAgregarEvento").addEventListener("submit",function(event){
    event.preventDefault()
    console.log('holaaaaa')
    const urlspost="../../eventos/registrarEvento/"
    let codigoevento=document.getElementById("txtCodigoEvento").value;
    let nombreevento=document.getElementById("txtNombreEvento").value;
    let tipoevento=document.getElementById("cboTipoEvento").value;
    let areatematica=document.getElementById("cboAreaTematica").value;
    let descevento=document.getElementById("txtDescripcion").value;
    let pais=document.getElementById("cboPais").value;
    let fechainicio=document.getElementById("txtFechainicio").value;
    let fechafin=document.getElementById("txtFechafin").value;
    let Tipoapoyo=document.getElementById("cboTipoApoyo").value;
    let entifinan=document.getElementById("cboTipoEnFinanciamiento").value;
    let instfinan = document.getElementById("cboTipoInsFinanciamiento").value;
    let tipo_moneda = document.getElementById("cboTipoMOneda").value;
    let monto = document.getElementById("txtMonto").value;
    let tipo_cambio = document.getElementById("txttipoCambio").value;
    let responsableIpen = document.getElementById("txtRespIpen").value;
    let responsableEntidad = document.getElementById("txtRespEnt").value;

    const csrftoken = getCookie("csrftoken");

    console.log(nombreevento)

    let data={
        codigoevento,
        nombreevento,
        tipoevento,
        areatematica,
        descevento,
        pais,
        fechainicio,
        fechafin,
        Tipoapoyo,
        entifinan,
        instfinan,
        tipo_moneda,
        monto,
        tipo_cambio,
        responsableIpen,
        responsableEntidad
    }

    console.log(data)
    fetch(urlspost,{
        method:"POST",
        headers:{
            "content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        body:JSON.stringify(data),
    }).then((response) => response.json()).then((response) => {
        if(response.success){
            limpiarCampos();
            NotificacionSwal("Éxito!", response.message, "success", "ok");
        }else{
            NotificacionSwal("Error!", response.message, "error", "ok");
        }
    }).catch((error)=>{
        console.error("Error en la solicitud :", error);
        NotificacionSwal(
          "Error!",
          "Hubo un problema al procesar la solicitud",
          "error",
          "ok"
        ); 
    }).finally(() => {
        console.log("Terminó la petición");
      });

})


function limpiarCampos() {
    const campos = [
      "txtCodigoEvento",
      "txtNombreEvento",
      "cboTipoEvento",
      "cboAreaTematica",
      "txtDescripcion",
      "cboPais",
      "txtFechainicio",
      "txtFechafin",
      "cboTipoApoyo",
      "cboTipoEnFinanciamiento",
      "cboTipoInsFinanciamiento",
      "cboTipoMOneda",
      "txtMonto",
      "txtRespEnt",
      "txtRespIpen",
      "txttipoCambio",
      'txtMontosoles'
    ];
  
    campos.forEach((campo) => {
      document.getElementById(campo).value = "";
    });
  }

//click en tipo de moneda
document
  .getElementById("cboTipoMOneda")
  .addEventListener("change", function () {
    this.value;
    let selectElement = this;
    let selectedOption = selectElement.options[selectElement.selectedIndex];
    let selectedText = selectedOption.text;
    VerificarTipoMoneda(selectedText);
  });


//EVENTO PARA CALCULAR TOTAL
document.getElementById("txtMonto").addEventListener("input", function () {
  let monto = this.value;
  clickmonto(monto)
});

document.getElementById("txttipoCambio").addEventListener("input", function () {
  let tipocambio = this.value;
  clicktipocammbio(tipocambio)
});