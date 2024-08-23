from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/',views.nuevo_usuario, name='nuevoUsuario'),
    path('agregarusuario/',views.agregarusuario, name='agregarusuario'),
    path('getusuario/<int:idusuario>/',views.getusuario, name='getusuario'),
    path('cambioestado/',views.cambioestado, name='cambioestado'),
    path('eliminarusuario/',views.eliminarusuario, name='eliminarusuario'),
]
