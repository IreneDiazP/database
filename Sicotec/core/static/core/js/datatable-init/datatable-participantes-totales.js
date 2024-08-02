$(document).ready(function () {
    var thead = $("#tblParticipantes thead th");
    var inputHTML = "";
    
    // Usa un DocumentFragment para reducir manipulaciones directas del DOM
    var fragment = document.createDocumentFragment();
    
    thead.each(function (index) {
      if (index < thead.length - 2) {
        var title = $(this).text();
        var inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.placeholder = title;
        
        // Aplicar estilos basados en el índice
        switch(index) {
          case 0:
          case 5:

            inputElement.style.textAlign = "center";
            break;
          case 1:
          case 2:
          case 3:

            inputElement.style.textAlign = "center";
            break;
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
    var table = $("#tblParticipantes").DataTable({
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
      //           return $("#tblParticipantes tfoot th").eq(columnIdx).text();
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
      //           return $("#tblParticipantes tfoot th").eq(columnIdx).text();
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
        [10, 25, 50, -1],
        ['Mostrar 10 filas', 'Mostrar 25 filas', 'Mostrar 50 filas', 'Mostrar todo']
      ],
      ordering: true,
      order: [[0, 'asc']],
    });
  
    // Agrega funcionalidad de búsqueda a cada campo de entrada en los encabezados
    table.columns().eq(0).each(function (colIdx) {
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
  