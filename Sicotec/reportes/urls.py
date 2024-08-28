from django.urls import path
from . import views
urlpatterns = [
    
    path('reporteproyecto/', views.reporteproyecto, name='reportepracticipanteproyecto'),
    
    # path('reporteparticipante/',views.reporteparticipante, name='reporteparticipante')
    path('generarreporte/',views.generar_reporte_area, name='generar_reporte_area')
        
    
]
