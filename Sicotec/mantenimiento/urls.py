from django.urls import path
from . import views
urlpatterns = [
    path('añadirnuevo/',views.nuevaInstitucion, name='nuevaInstitucion'),
    # traer datos de la institucion
    path('getInstitucion/<int:idinstitucion>/',views.getInstitucion, name='getInstitucion'),
    
    path('editarinstitucion/',views.editarinstitucion, name='editarinstitucion'),
    
    path('eliminarInstituciones/',views.eliminarInstituciones, name='eliminarInstituciones')
]
