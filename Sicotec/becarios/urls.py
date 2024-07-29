from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/',views.nuevoParticipante, name='nuevoParticipante'),
    
    path('todosparticipantes/',views.todosparticipantes, name='todosparticipantes'),
    path('editarparticipante/',views.editarparticipante,name='editarparticipante')
]
