$(document).ready(function () {

    $("#tblProyectos thead th").each(function (index) {
        if (index < $("#tblProyectos thead th").length - 1) {
            var title = $("#tblProyectos thead th").eq(index).text();
            var inputHTML = '<input  type="text" placeholder="' + title + '"';
            if (index === 0 || index === 1 || index === 4) {
                inputHTML += ' style="max-width: 134px; text-align: center;"';
            }
            if (index === 2 || index === 6 || index === 7) {
                inputHTML += ' style="width: 300px !important; text-align: center;"';
            }
            if (index === 3) {
                inputHTML += ' style="width: 450px !important; text-align: center;"';
            }
            if (index === 8) {
                inputHTML += ' style="width: 160px !important; text-align: center;"';
            }
            if (index === 11 || index === 12) {
                inputHTML += ' style="max-width: 250px; text-align: center;"';
            }
            if (index === 14 || index === 15) {
                inputHTML += ' style="max-width: 100px; text-align: center;"';
            }
            if (index === 5 || index === 9 || index === 10 || index === 13) {
                inputHTML += ' style="text-align: center;"';
            }

            inputHTML += ' />';
            $(this).html(inputHTML);
        }
    });

 // Inicializar DataTable con scroll horizontal y botones de exportar
 var table = $("#tblProyectos").DataTable({
    scrollX: true,
    dom: 'Bfrtip', // Necesario para que los botones se muestren
    buttons: [
        {
            extend: 'excelHtml5',
            text: 'Excel',
            className: 'btn btn-success',
            exportOptions: {
                columns: ':visible',
                format: {
                    header: function (data, columnIdx) {
                        // Devuelve el título de la columna
                        return $('#tblProyectos tfoot th').eq(columnIdx).text();
                    }
                }
            }
        },
        {
            extend: 'pdfHtml5',
            text: 'PDF',
            className: 'btn btn-danger',
            orientation: 'landscape', // Orientación horizontal
            pageSize: 'A0', // Tamaño de página A4
            exportOptions: {
                columns: ':visible',
                format: {
                    header: function (data, columnIdx) {
                        // Devuelve el título de la columna
                        return $('#tblProyectos tfoot th').eq(columnIdx).text();
                    }
                }
            },
            customize: function (doc) {
                doc.content[1].table.widths = '*'.repeat(doc.content[1].table.body[0].length).split('');
                doc.styles.tableHeader.alignment = 'center';
            },
            title: 'Reporte Proyectos - Soft - Sicotec',
        }
    ]
});
    table.columns().eq(0).each(function (colIdx) {
        if (colIdx < table.columns().nodes().length - 1) {
            $("input", table.column(colIdx).header()).on("keyup change", function () {
                table.column(colIdx).search(this.value).draw();
            });

            $("input", table.column(colIdx).header()).on("click", function (e) {
                e.stopPropagation();
            });
        }
    });
});
