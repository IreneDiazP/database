document.addEventListener('DOMContentLoaded', function() {
    const tablaparticipante = document.getElementById('tblParticipantes');

    tablaparticipante.addEventListener('click', function(event) {
        console.log('click');
        const target = event.target;
        if (target.tagName === 'TH') {
            let row = target.parentNode;
            let cells = row.getElementsByTagName('th'); // Corregido aquí
            var cellData = Array.from(cells).map(cell => cell.textContent);
            window.location.href = '../editarparticipante/';
        }
    });
});
