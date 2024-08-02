from django.contrib import admin
from .models import Proyecto, Pais, Tipo_Proyecto, Entidad_Financiamiento, Institucion_Financiamiento, Tipo_Apoyo, Area_Tematica, Tipo_Moneda,Sede

# Register your models here.

class ProyectoAdmin(admin.ModelAdmin):
    model=Proyecto
    list_display=['cTipo_proyecto','nomProyecto','cEntFinan','cInstFinanc','responsableEnt']
    
    
admin.site.register(Proyecto,ProyectoAdmin)
admin.site.register(Pais)
admin.site.register(Tipo_Proyecto)
admin.site.register(Entidad_Financiamiento)
admin.site.register(Institucion_Financiamiento)
admin.site.register(Tipo_Apoyo)
admin.site.register(Area_Tematica)
admin.site.register(Tipo_Moneda)
admin.site.register(Sede)
