document.addEventListener('DOMContentLoaded', function () {
    const modalElement = document.getElementById('ReporteAreaModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    
    modalInstance.show();

    document.getElementById('formReportArea').addEventListener('submit', function (event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': form.querySelector('input[name="csrfmiddlewaretoken"]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.html) {
                document.getElementById('vistaPreviaReporte').innerHTML = data.html;
                document.getElementById('contenedor__buttons').classList.remove('invisible')

                // Verificar si el modal está abierto antes de cerrarlo
                if (modalElement.classList.contains('show')) {
                    modalInstance.hide();
                }
            } else {
                alert('Error generando el reporte');
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

document.getElementById('button_Exportar').addEventListener('click', function() {
  const element = document.getElementById('vistaPreviaReporte');

  const options = {
    margin: [10, 15, 10, 10], 
    filename: 'reporte_area.pdf',
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };


  html2pdf().from(element).set(options).save();
});


