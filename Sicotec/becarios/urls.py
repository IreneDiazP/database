from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/',views.nuevoParticipante, name='nuevoParticipante'),
    
    #REGISTRAR NUEVO PARTICPANTE
    path('registrarParticpante/',views.registrarParticpante, name='registrarParticpante'),

    
    #traer todos los participantes
    path('todosparticipantes/',views.todosparticipantes, name='todosparticipantes'),
    
    #actualizar participantes el tipo de participante y el estado
    path('actualizarParticipante/',views.actualizarParticipante,name='actualizarParticipante'),
    
    #url todos de editar participante renderizar los datos para participantes
    path('editarparticipante/<int:idparticipante>/',views.editarparticipante,name='editarparticipante'),
    
    #traer datos de un participante
    path('getdatosparticipante/',views.getdatosparticipante,name='getdatosparticipante'),
    
    #obtener provincias de departamento
    path('getProvincias/<int:iddepartamento>/',views.getProvincias,name='getProvincias'),
    
    #obtener provincias de departamento
    path('getDistrito/<int:idprovincia>/',views.getDistrito,name='getDistrito'),
    
    #otener datos del evento 
    path('getDatosEvento/<int:idEvento>',views.get_Evento, name="get_DatosProyecto"),
    
    #añadir el evento a detalles eventos proyecto 
    path('añadireventoproyecto/',views.añadireventoproyecto, name="añadireventoproyecto"),
        
    #añadir el evento a detalles eventos proyecto 
    path('modificarparticipante/<int:idparticipante>',views.modificarparticipante, name="modificarparticipante"),
    
    #obtener datos del evento para editar 
    path('editareventoparticipante/<int:idevento>/<int:idparticipante>/',views.editareventoparticipante, name="editareventoparticipante"),
        #obtener datos del evento para editar 
    path('eliminareventoparticipante/',views.eliminareventoparticipante, name="eliminareventoparticipante"),
    
    #BUSCAR PROYECTO PARA AÑADIR
   
    path('getProyectoParticipante/<int:idproyecto>',views.getProyectoParticipante, name="getProyectoParticipante"),
    
    path('añadirproyectoparticipante/',views.añadirproyectoparticipante, name="añadirproyectoparticipante"),
    
    #obtener datos del proyecto para editar 
    path('editarproyectoparticipante/<int:idproyecto>/<int:idparticipante>/',views.editarproyectoparticipante, name="editarproyectoparticipante"),
    
    path('eliminarproyectoparticipante/',views.eliminarproyectoparticipante, name="eliminarproyectoparticipante"),
    
]
