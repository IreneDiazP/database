document.addEventListener("DOMContentLoaded", function () {
    const tablaparticipante = document.getElementById("tblParticipantes");

    tablaparticipante.addEventListener("click", function (event) {
        console.log("click");
        const target = event.target;

        if (target.tagName === "TH") {
            let row = target.parentNode;

            if (row.tagName === "TR") {
                let rowId = row.id;
                console.log("ID de la fila:", rowId);

              
                // window.location.href = `/editarparticipante/?id=${rowId}`;
            }
        }
    });
});