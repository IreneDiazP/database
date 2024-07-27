from django.contrib import admin
from .models import Tipo_Evento,Evento

# Register your models here.
class EventoAdmin(admin.ModelAdmin):
    model=Evento
    list_display=['cTipoEvento','nomEvento']
    
admin.site.register(Tipo_Evento)
admin.site.register(Evento,EventoAdmin)
