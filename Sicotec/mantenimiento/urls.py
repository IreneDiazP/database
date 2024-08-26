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
    
    #CRUD TEMATICA
    path('añadirnuevatematica/',views.añadirnuevatematica, name='añadirnuevatematica'),
    
    path('getTematica/<int:idtematica>/',views.getTematica, name='getTematica'),
    
    path('editartematica/',views.editartematica, name='editartematica'),

    path('eliminartematica/',views.eliminartematica, name='eliminartematica'),
    
    #CRUD TIPO APOYO
    path('añadirnuevotipoapoyo/',views.añadirnuevotipoapoyo, name='añadirnuevotipoapoyo'),
    
    path('getTipoApoyo/<int:idtipoapoyo>/',views.getTipoApoyo, name='getTipoApoyo'),
    
    path('editartipoapoyo/',views.editartipoapoyo, name='editartipoapoyo'),

    path('eliminartipoapoyo/',views.eliminartipoapoyo, name='eliminartipoapoyo'),
    
        #CRUD TIPO PROYECTO
    path('añadirnuevotipoproyecto/',views.añadirnuevotipoproyecto, name='añadirnuevotipoproyecto'),
    
    path('getTiproyecto/<int:idtipoproyecto>/',views.getTiproyecto, name='getTiproyecto'),
    
    path('editartipoproyecto/',views.editartipoproyecto, name='editartipoproyecto'),

    path('eliminartipoproyecto/',views.eliminartipoproyecto, name='eliminartipoproyecto'),
    
    #CRUD TIPO EVENTO
    path('añadirnuevotipoevento/',views.añadirnuevotipoevento, name='añadirnuevotipoevento'),
    
    path('getTievento/<int:idtipoevento>/',views.getTievento, name='getTievento'),
    
    path('editartipoevento/',views.editartipoevento, name='editartipoevento'),

    path('eliminartipoevento/',views.eliminartipoevento, name='eliminartipoevento'),
]
