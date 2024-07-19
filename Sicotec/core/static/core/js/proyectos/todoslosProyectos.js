$(document).ready(function () {
    $("#tblProyectos thead th").each(function (index) {
        if (index < $("#tblProyectos thead th").length - 1) { 
            var title = $("#tblProyectos tfoot th").eq(index).text();
            $(this).html('<input type="text" placeholder="Buscar ' + title + '" />');
        }
    });

    var table = $("#tblProyectos").DataTable({
        scrollX: true
        
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
