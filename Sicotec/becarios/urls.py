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
    
    #url todos de editar participante
    path('editarparticipante/<int:idparticipante>/',views.editarparticipante,name='editarparticipante'),
    
    #traer datos de un participante
    path('getdatosparticipante/',views.getdatosparticipante,name='getdatosparticipante'),
    
    #obtener provincias de departamento
    path('getProvincias/<int:iddepartamento>/',views.getProvincias,name='getProvincias'),
    
    #obtener provincias de departamento
    path('getDistrito/<int:idprovincia>/',views.getDistrito,name='getDistrito'),
    
    #otener datos del evento 
    path('getDatosEvento/<int:idEvento>',views.get_Evento, name="get_DatosProyecto")
    

]
