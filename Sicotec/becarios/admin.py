from django.contrib import admin
from .models import Tipo_Documento,FormacionAcademica,Participante

# Register your models here.

admin.site.register(Tipo_Documento)
admin.site.register(FormacionAcademica)
admin.site.register(Participante)