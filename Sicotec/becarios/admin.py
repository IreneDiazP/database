

from django.contrib import admin
from .models import Tipo_Documento, FormacionAcademica, Participante,Det_EventoProyecto

class ParticipanteAdmin(admin.ModelAdmin):
    model = Participante
    list_display = [
        'apellPate_participante',
        'apellMate_participante',
        'nom_participante',
        'tipo_participante',
        'procedencia',
        'estado'
    ]
    filter_horizontal = ('proyectos', 'eventos')  


admin.site.register(Tipo_Documento)
admin.site.register(FormacionAcademica)
# admin.site.register(Participante, ParticipanteAdmin)
admin.site.register(Det_EventoProyecto)

