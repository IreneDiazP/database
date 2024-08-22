from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/',views.nuevo_usuario, name='nuevoUsuario'),
    path('agregarusuario/',views.agregarusuario, name='agregarusuario')
]
