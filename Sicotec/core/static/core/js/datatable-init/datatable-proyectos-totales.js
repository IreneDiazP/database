$(document).ready(function () {
  $("#tblProyectos thead th").each(function (index) {
    if (index < $("#tblProyectos thead th").length - 1) {
      var title = $("#tblProyectos thead th").eq(index).text();
      var inputHTML = '<input  type="text" placeholder="' + title + '"';
      if (index === 1 || index === 5 || index === 6) {
        inputHTML += ' style="max-width: 134px; text-align: center;"';
      }
      if (index === 2) {
        inputHTML += ' style="width: 300px !important; text-align: center;"';
      }
      if (index === 3 || index === 4) {
        inputHTML += ' style= "text-align: center;"';
      }

      inputHTML += " />";
      $(this).html(inputHTML);
    }
  });

  var table = $("#tblProyectos").DataTable({
    scrollX: true,
    dom: "frltip",
    // buttons: [
    //   {
    //     extend: "excelHtml5",
    //     text: "Excel",
    //     className: "btn btn-success",
    //     exportOptions: {
    //       columns: ":visible",
    //       format: {
    //         header: function (data, columnIdx) {
    //           return $("#tblProyectos tfoot th").eq(columnIdx).text();
    //         },
    //       },
    //     },
    //   },
    //   {
    //     extend: "pdfHtml5",
    //     text: "PDF",
    //     className: "btn btn-danger",
    //     orientation: "landscape",
    //     pageSize: "A0",
    //     exportOptions: {
    //       columns: ":visible",
    //       format: {
    //         header: function (data, columnIdx) {
    //           return $("#tblProyectos tfoot th").eq(columnIdx).text();
    //         },
    //       },
    //     },
    //     customize: function (doc) {
    //       doc.content[1].table.widths = "*"
    //         .repeat(doc.content[1].table.body[0].length)
    //         .split("");
    //       doc.styles.tableHeader.alignment = "center";
    //     },
    //     title: "Reporte Proyectos - Soft - Sicotec",
    //   },
    // ],
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
    order: [[0, "desc"]],
    columnDefs: [{ targets: [0], visible: false, searchable: false }],
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
