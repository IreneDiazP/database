from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/',views.nuevoParticipante, name='nuevoParticipante'),
    
    #traer todos los participantes
    path('todosparticipantes/',views.todosparticipantes, name='todosparticipantes'),
    
    
    #url todos de editar participante
    path('editarparticipante/',views.editarparticipante,name='editarparticipante'),
    
    #obtener provincias de departamento
    path('getProvincias/<int:iddepartamento>/',views.getProvincias,name='getProvincias')
]
