document.addEventListener("DOMContentLoaded", function () {
    const url = window.location.pathname; 
    const parts = url.split('/'); 
    const participanteidId = parts[parts.length - 2]; 

    const data = { participanteidId: participanteidId };

    console.log("participanteidId:", participanteidId);

    const csrftoken = getCookie("csrftoken");
    const urlsposttt = "/becario/getdatosparticipante/";
    
    fetch(urlsposttt, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Datos de los participantes:', data.data);
            
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
