from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Tipo_Evento,Evento,Tipo_Apoyo,Entidad_Financiamiento,Institucion_Financiamiento,Tipo_Moneda,Area_Tematica,Pais
# Create your views here.
@login_required
def nuevoevento(request):
    Tipo_Eventos=Tipo_Evento.objects.all()
    pais = Pais.objects.all().order_by('cpais')
    TipoApoyo = Tipo_Apoyo.objects.all().order_by('ctipo_apoyo')
    EntFinan = Entidad_Financiamiento.objects.all().order_by('cEntFinancia')
    InsFinan = Institucion_Financiamiento.objects.all().order_by('cInstFinancia')
    TipoMoneda = Tipo_Moneda.objects.all().order_by('cTipo_moneda')
    AreaTem = Area_Tematica.objects.all().order_by('cArea_tematica')
    Eventos=Evento.objects.all().order_by('nomEvento')
    
    return render(request,'eventos/nuevoevento.html',{
        'Tipo_Eventos':Tipo_Eventos,
        'Eventos':Eventos,
        'pais': pais,
        'TipoApoyo': TipoApoyo,
        'EntFinan': EntFinan,
        'InsFinan': InsFinan,
        'TipoMoneda': TipoMoneda,
        'AreaTem': AreaTem
    })