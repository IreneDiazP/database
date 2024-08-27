$(document).ready(function () {
    $("#tblUsuarios thead th").each(function (index) {
      if (index < $("#tblUsuarios thead th").length - 2) {
        var title = $("#tblUsuarios thead th").eq(index).text();
        var inputHTML = '<input  type="text" placeholder="' + title + '"';

        if (index === 1 || index === 2 || index === 3 || index === 4 || index === 5 ) {
            inputHTML += ' style="width: 100%; text-align: center;"';
        }

  
        inputHTML += " />";
        $(this).html(inputHTML);
      }
    });
  
    var table = $("#tblUsuarios").DataTable({
      scrollX: true,
      dom: "frltip",
      language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior",
        },
      },
      lengthMenu: [
        [5, 10, 25, 50, -1],
        [
          "Mostrar 5 filas",
          "Mostrar 10 filas",
          "Mostrar 25 filas",
          "Mostrar 50 filas",
          "Mostrar todo",
        ],
      ],
      ordering: true,
      order: [[0, "-desc"]],
    });
    table
      .columns()
      .eq(0)
      .each(function (colIdx) {
        if (colIdx < table.columns().nodes().length - 1) {
          $("input", table.column(colIdx).header()).on(
            "keyup change",
            function () {
              table.column(colIdx).search(this.value).draw();
            }
          );
  
          $("input", table.column(colIdx).header()).on("click", function (e) {
            e.stopPropagation();
          });
        }
      });
  });
  