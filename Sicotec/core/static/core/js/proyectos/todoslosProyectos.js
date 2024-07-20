$(document).ready(function () {
    $("#tblProyectos thead th").each(function (index) {
        if (index < $("#tblProyectos thead th").length - 1) {
            var title = $("#tblProyectos thead th").eq(index).text();
            var inputHTML = '<input  type="text" placeholder="' + title + '"';
            if (index === 0 || index === 1 ||index === 4  ) {
                inputHTML += ' style="max-width: 134px; text-align: center;"';
            }
            if (index === 2 || index === 6 || index === 7) {
                inputHTML += ' style="width: 300px !important; text-align: center;"';
            }
            if (index === 3 ) {
                inputHTML += ' style="width: 450px !important;  text-align: center;"';
            }
            if (index === 8 ) {
                inputHTML += ' style="width: 160px !important;  text-align: center;"';
            }
            if( index === 11 || index === 12){
                inputHTML += ' style="max-width: 250px;  text-align: center;"';
            }
            if( index === 14 || index === 15){
                inputHTML += ' style="max-width: 100px;  text-align: center;"';
            }
            if( index === 5 || index === 9 || index === 10 || index === 13){
                inputHTML += ' style="text-align: center;"';
            }

            inputHTML += ' />';
            $(this).html(inputHTML);
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
