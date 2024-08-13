const NotificacionSwal=(title,text,icon,confirmButtonText)=>{

    Swal.fire({
        title:title,
        text:text,
        icon: icon,//warning,error,success. info
        confirmButtonText:confirmButtonText
    })
}