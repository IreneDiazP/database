from django.urls import path
from . import views
urlpatterns = [
    #CRUD INSTITUCIONES
    path('añadirnuevo/',views.nuevaInstitucion, name='nuevaInstitucion'),
    path('getInstitucion/<int:idinstitucion>/',views.getInstitucion, name='getInstitucion'),
    
    path('editarinstitucion/',views.editarinstitucion, name='editarinstitucion'),
    
    path('eliminarInstituciones/',views.eliminarInstituciones, name='eliminarInstituciones'),
    
    # CRUD ENTIDADES
    path('añadirnuevoentidad/',views.añadirnuevoentidad, name='añadirnuevoentidad'),
        
    path('getEntidad/<int:identidad>/',views.getEntidad, name='getEntidad'),
    
    path('editarentidad/',views.editarentidad, name='editarentidad'),
    
    path('eliminarEntidad/',views.eliminarEntidad, name='eliminarEntidad'),
]
