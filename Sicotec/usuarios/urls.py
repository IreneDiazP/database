from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/',views.nuevobecario, name='nuevoUsuario')
]
