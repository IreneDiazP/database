document.addEventListener("DOMContentLoaded", function () {
  console.log("hola password");

  var estado = document.getElementById("estadocontraseña").value;
  console.log(estado);

  var modal = document.getElementById("cambiarContraseñaModal");
  var cambiarContraseñaModal = new bootstrap.Modal(modal);

  if (estado === "True") {
    cambiarContraseñaModal.show();
  }

  modal.addEventListener("hide.bs.modal", function (event) {
    if (document.getElementById("estadocontraseña").value === "True") {
      event.preventDefault();
    }
  });

  document
    .getElementById("cambiarContraseñaForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      var new_password = document.getElementById("new_password").value;
      var confirm_password = document.getElementById("confirm_password").value;
      var data = {
        new_password,
        confirm_password,
      };
      var csrftoken = getCookie("csrftoken");
      var url = "../../cambiopassword/";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            cambiarContraseñaModal.hide();
            window.location.href = response.redirect;
          } else {
            NotificacionSwal("Error!", response.message, "error", "ok");
          }
        })
        .catch((error) => {
          NotificacionSwal(
            "Error!",
            "Hubo un problema con la solicitud. Inténtelo de nuevo.",
            "error",
            "ok"
          );
          console.error("Error en la solicitud:", error);
        });
    });
});

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
