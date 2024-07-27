from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import json
from .models import Tipo_Evento,Evento,Tipo_Apoyo,Entidad_Financiamiento,Institucion_Financiamiento,Tipo_Moneda,Area_Tematica,Pais
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
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
    
@login_required
def registrarEvento(request):
    if request.method =='POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            print(data)
            
            x_codigoevento = data.get('codigoevento')
            x_nomevento = data.get('nombreevento')
            x_tipoevento = data.get('tipoevento')
            x_areatem = data.get('areatematica')
            x_descrevento = data.get('descevento')
            x_pais = data.get('pais')
            x_fechainicio = data.get('fechainicio')
            x_fechafin = data.get('fechafin')
            x_tipoapoyo = data.get('Tipoapoyo')
            x_entifinan = data.get('entifinan')
            x_instifinan = data.get('instfinan')
            x_tipomoneda = data.get('tipo_moneda')
            x_monto = data.get('monto')
            x_tipocamnbio = data.get('tipo_cambio')
            x_created_by = request.user
            
            #instancias
            x_tipoevento_instance=Tipo_Evento.objects.get(id=x_tipoevento)
            x_areatema_instance=Area_Tematica.objects.get(id=x_areatem)
            x_pais_instance=Pais.objects.get(id=x_pais)
            x_tipoapoyo_instance=Tipo_Apoyo.objects.get(id=x_tipoapoyo)
            x_Entifina_instance=Entidad_Financiamiento.objects.get(id=x_entifinan)
            x_institufina_instance=Institucion_Financiamiento.objects.get(id=x_instifinan)
            x_tipomoneda_instance=Tipo_Moneda.objects.get(id=x_tipomoneda)

            eventonuevo=Evento(
                codigoEvento = x_codigoevento,
                nomEvento = x_nomevento,
                cTipoEvento = x_tipoevento_instance,
                cAreaTem = x_areatema_instance,
                DescEvento = x_descrevento,
                cpais = x_pais_instance,
                fechaInicio = x_fechainicio,
                fechaFin = x_fechafin,
                cTipoApoyo = x_tipoapoyo_instance,
                cEntFinan = x_Entifina_instance,
                cInstFinanc = x_institufina_instance,
                cTipo_Moneda = x_tipomoneda_instance,
                monto = x_monto,
                tipo_Cambio = x_tipocamnbio,
                created_by=x_created_by
                
            )
            
            eventonuevo.save()
            
            return JsonResponse({'success': True, 'message': 'Evento registrado correctamente'})
        except ObjectDoesNotExist as e:
            return JsonResponse({'success': False, 'message': f'Error al registrar el Evento: {str(e)}'}, status=500)


def todosEventos(request):
    todoeventos=Evento.objects.all().order_by('-id')
    for te in todoeventos:
        te.fechaInicio = te.fechaInicio.strftime('%d/%m/%Y')
        te.fechaFin = te.fechaFin.strftime('%d/%m/%Y')
        
    print(todoeventos)
    
    print('holaaaa')
    return render(request,'eventos/todoseventos.html',{
        'todoeventos':todoeventos
    })