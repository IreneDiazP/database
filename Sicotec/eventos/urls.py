from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/',views.nuevoevento, name='nuevoEvento'),
    # registrar nuevo evento
    path('registrarEvento/', views.registrarEvento, name='registrarEvento'),
    
    #todos los eventos
    path('todosEventos/', views.todosEventos, name='todosEventos'),
    
    
]
