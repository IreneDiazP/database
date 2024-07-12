from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/',views.nuevo_usuario, name='nuevoUsuario')
]
