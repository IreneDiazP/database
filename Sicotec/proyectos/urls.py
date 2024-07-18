from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/', views.nuevoproyecto, name='nuevoproyecto'),

    # registrar nuevo proyecto
    path('registrarProyecto/', views.registrarProyecto, name='registrarProyecto')
]
