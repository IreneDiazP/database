from django.contrib import admin
from .models import Proyecto, Pais, Tipo_Proyecto, Entidad_Financiamiento, Institucion_Financiamiento, Tipo_Apoyo, Area_Tematica, Tipo_Moneda,Sede

# Register your models here.
admin.site.register(Proyecto)
admin.site.register(Pais)
admin.site.register(Tipo_Proyecto)
admin.site.register(Entidad_Financiamiento)
admin.site.register(Institucion_Financiamiento)
admin.site.register(Tipo_Apoyo)
admin.site.register(Area_Tematica)
admin.site.register(Tipo_Moneda)
admin.site.register(Sede)
