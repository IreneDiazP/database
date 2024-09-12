from django.urls import path
from . import views
urlpatterns = [
    
    path('reporteproyecto/', views.reporteproyecto, name='reportepracticipanteproyecto'),
    
    path('generarreporte/',views.generar_reporte_area, name='generar_reporte_area'),
    
    path('reporteevento/', views.reporteevento, name='reporteevento')
        
    
]
