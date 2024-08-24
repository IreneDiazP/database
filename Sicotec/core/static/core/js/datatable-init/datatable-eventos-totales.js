$(document).ready(function () {
  var thead = $("#tblEventos thead th");
  var inputHTML = "";

  // Usa un DocumentFragment para reducir manipulaciones directas del DOM
  var fragment = document.createDocumentFragment();

  thead.each(function (index) {
    if (index < thead.length - 1) {
      var title = $(this).text();
      var inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.placeholder = title;

      // Aplicar estilos basados en el índice
      switch (index) {
        case 5:
        case 6:
        case 1:
          inputElement.style.maxWidth = "134px";
          inputElement.style.textAlign = "center";
          break;
        case 2:
          inputElement.style.maxWidth = "300px";
          inputElement.style.textAlign = "center";
          break;
        case 3:
        case 4:
          inputElement.style.textAlign = "center";
          break;
      }

      // Añadir el input al fragmento
      fragment.appendChild(inputElement);
      $(this).html(inputElement);
    }
  });

  // Inicializa DataTable
  var table = $("#tblEventos").DataTable({
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
    //           return $("#tblEventos tfoot th").eq(columnIdx).text();
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
    //           return $("#tblEventos tfoot th").eq(columnIdx).text();
    //         },
    //       },
    //     },
    //     customize: function (doc) {
    //       doc.content[1].table.widths = "*".repeat(doc.content[1].table.body[0].length).split("");
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
        var inputField = $("input", table.column(colIdx).header());
        inputField.on("keyup change", function () {
          table.column(colIdx).search(this.value).draw();
        });

        inputField.on("click", function (e) {
          e.stopPropagation();
        });
      }
    });
});
