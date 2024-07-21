from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/', views.nuevoproyecto, name='nuevoproyecto'),

    # registrar nuevo proyecto
    path('registrarProyecto/', views.registrarProyecto, name='registrarProyecto'),
    
   #traer todos los proyecto
    path('todosProyectos/', views.todosProyectos, name='todosProyectos'),
    
    #para cambio de proyectos
    path('getInstituciones/<int:entidad_id>/', views.getInstituciones, name='getInstituciones'),

]
