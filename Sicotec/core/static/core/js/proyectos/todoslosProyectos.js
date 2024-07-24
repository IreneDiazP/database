import { CargardatoProyecto } from "./editareliminarproyecto.mjs";

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#tblProyectos tbody")
    .addEventListener("click", async function (event) {
      if (
        event.target.classList.contains("editBtn") ||
        event.target.closest(".editBtn")
      ) {
        let idRegistroProyecto = event.target.closest("tr").getAttribute("id");
        document.getElementById("txtIdProyectoModalEditarProyecto").value =
          idRegistroProyecto;
        console.log("ID del proyecto:", idRegistroProyecto);
        CargardatoProyecto(idRegistroProyecto);
      }
    });
});
