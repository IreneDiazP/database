// document
//   .getElementById("RCapacitacionArea")
//   .addEventListener("click", function (event) {
//     event.preventDefault();
//     fetch("/getareas/")
//       .then((response) => response.json())
//       .then((data) => {
//         const datos = data.data;
//         console.log(datos);

//         const modalElement = document.getElementById("ReporteAreaModal");
//         const modal = new bootstrap.Modal(modalElement);

//         const selectElement = document.getElementById("cboArea");

//         let optionsHtml = '<option value="">Selecciona el Area</option>';

//         datos.forEach((area) => {
//           optionsHtml += `<option value="${area.id}">${area.cArea_tematica}</option>`;
//         });

//         selectElement.innerHTML = optionsHtml;

//         modal.show();
//       })
//       .catch((error) => console.error("Error:", error));
//   });


// document.getElementById('formReportArea').addEventListener('submit', function(event){
//     event.preventDefault()
//     x_año = document.getElementById('Año').value
//     x_area = document.getElementById('cboArea').value

//     console.log(x_año+' '+ x_area)

//     const data = {
//         x_año,
//         x_area
//       };

// const urlpost ="/reportes/reporteparticipante/"

// fetch(urlpost)

// })

// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== "") {
//       const cookies = document.cookie.split(";");
//       for (let i = 0; i < cookies.length; i++) {
//         const cookie = cookies[i].trim();
//         if (cookie.substring(0, name.length + 1) === name + "=") {
//           cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//           break;
//         }
//       }
//     }
//     return cookieValue;
//   }