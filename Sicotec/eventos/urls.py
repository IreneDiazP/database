from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/',views.nuevoevento, name='nuevoEvento'),
    # registrar nuevo evento
    
    path('registrarEvento/', views.registrarEvento, name='registrarEvento'),
    
    #editar proyecto
    path('editarevento/<int:idEvento>', views.editarevento, name='editarevento'),
    
    #eliminar evento
    path('eliminarEvento/',views.eliminarEvento, name="eliminarEvento"),

    
    #todos los eventos
    path('todosEventos/', views.todosEventos, name='todosEventos'),
    
    #otener datos del evento 
    path('getDatosEvento/<int:idEvento>',views.get_Evento, name="get_DatosProyecto")
]
