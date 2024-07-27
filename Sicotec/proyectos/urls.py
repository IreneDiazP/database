from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/', views.nuevoproyecto, name='nuevoproyecto'),

    # registrar nuevo proyecto
    path('registrarProyecto/', views.registrarProyecto, name='registrarProyecto'),
    #editar proyecto
    path('editarproyecto/<int:idProyecto>', views.editarproyecto, name='editarproyecto'),
    #eliminar proyecto
    path('eliminarProyecto/',views.eliminarProyecto, name="eliminarproyecto"),

    
   #traer todos los proyecto
    path('todosProyectos/', views.todosProyectos, name='todosProyectos'),
    
    #para cambio de proyectos
    path('getInstituciones/<int:entidad_id>/', views.getInstituciones, name='getInstituciones'),
    
    path('getDatosProyecto/<int:idProyecto>',views.get_DatosProyecto, name="get_DatosProyecto")

]
