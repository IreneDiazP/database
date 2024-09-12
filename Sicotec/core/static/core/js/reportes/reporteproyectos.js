document.addEventListener("DOMContentLoaded", function () {
  const modalElement = document.getElementById("ReporteAreaModal");
  const modalInstance = new bootstrap.Modal(modalElement);

  modalInstance.show();

  document
    .getElementById("formReportArea")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("click en submit");
      const form = event.target;
      const formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": form.querySelector('input[name="csrfmiddlewaretoken"]')
            .value,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.html) {
            document.getElementById("vistaPreviaReporte").innerHTML = data.html;
            console.log("click en submit 2");
            document
              .getElementById("contenedor__buttons")
              .classList.remove("invisible");
            console.log("click en submit 3");

            modalInstance.hide();
            limpiarCampos();
          } else {
            alert("Error generando el reporte");
          }
        })
        .catch((error) => console.error("Error:", error));
    });
});

// document
//   .getElementById("button_Exportar")
//   .addEventListener("click", function () {
//     const element = document.getElementById("vistaPreviaReporte");

//     const options = {
//       margin: [10, 15, 10, 10],
//       filename: "reporte_area.pdf",
//       html2canvas: { scale: 2, useCORS: true },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     };

//     html2pdf().from(element).set(options).save();
//   });

document.getElementById("button_Exportar").addEventListener("click", function () {
  const element = document.getElementById("vistaPreviaReporte");

  const options = {
    margin: [10, 15, 10, 10],
    filename: "reporte_area.pdf",
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: 'avoid-all' }
  };

  html2pdf().from(element).toPdf().get('pdf').then(function (pdf) {
    // Total number of pages
    const totalPages = pdf.internal.getNumberOfPages();
    
    // Add page count to the content
    const pageCountText = `Página ${pdf.internal.getCurrentPageInfo().pageNumber} de ${totalPages}`;
    document.getElementById("page-count").textContent = pageCountText;

    // Re-generate the PDF to include the page count
    html2pdf().from(element).set(options).save();
  });
});

document
  .getElementById("button_NuevoReporte")
  .addEventListener("click", function () {
    limpiarCampos();
    const modalElement = document.getElementById("ReporteAreaModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.show();
  });

function limpiarCampos() {
  const campos = ["Año", "cboAreaTematica"];

  campos.forEach((campo) => {
    document.getElementById(campo).value = "";
  });
}
