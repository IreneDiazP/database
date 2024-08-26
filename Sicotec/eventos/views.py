from django.shortcuts import render,redirect
from django.db import transaction
from django.utils import timezone
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
            x_responsableipen=data.get('responsableIpen')
            x_responsableEntidad=data.get('responsableEntidad')
            x_created_by = request.user
            
            #instancias
            x_tipoevento_instance=Tipo_Evento.objects.get(id=x_tipoevento)
            x_areatema_instance=Area_Tematica.objects.get(id=x_areatem)
            x_pais_instance=Pais.objects.get(id=x_pais)
            x_tipoapoyo_instance=Tipo_Apoyo.objects.get(id=x_tipoapoyo) if x_tipoapoyo else None
            x_Entifina_instance=Entidad_Financiamiento.objects.get(id=x_entifinan) if x_entifinan else None
            x_institufina_instance=Institucion_Financiamiento.objects.get(id=x_instifinan) if x_instifinan else None
            x_tipomoneda_instance=Tipo_Moneda.objects.get(id=x_tipomoneda) if x_tipomoneda else None 

            eventonuevo=Evento(
                codigoEvento = x_codigoevento,
                nomEvento = x_nomevento,
                cTipoEvento = x_tipoevento_instance,
                cAreaTem = x_areatema_instance,
                DescEvento = x_descrevento if x_descrevento else None ,
                cpais = x_pais_instance,
                fechaInicio = x_fechainicio,
                fechaFin = x_fechafin if x_fechafin else None ,
                cTipoApoyo = x_tipoapoyo_instance,
                cEntFinan = x_Entifina_instance,
                cInstFinanc = x_institufina_instance,
                cTipo_Moneda = x_tipomoneda_instance,
                monto = x_monto  if x_monto else None,
                tipo_Cambio = x_tipocamnbio  if x_tipocamnbio else None ,
                responsable= x_responsableipen,
                responsableEnt = x_responsableEntidad if x_responsableEntidad else None,
                created_by=x_created_by
                
            )
            
            eventonuevo.save()
            
            return JsonResponse({'success': True, 'message': 'Evento registrado correctamente'})
        except ObjectDoesNotExist as e:
            return JsonResponse({'success': False, 'message': f'Error al registrar el Evento: {str(e)}'}, status=500)


def editarevento(request,idEvento):
   
    try:
        with transaction.atomic():
            if request.method == 'POST':
                eventoeditado=Evento.objects.get(id = idEvento)
                codigoevento=request.POST.get('txtCodigoEvento')
                nombrevento=request.POST.get('txtNombreEvento')
                tipoevento_id=request.POST.get('cboTipoEvento')
                aretematica_id=request.POST.get('cboAreaTematica')
                descripcionevento=request.POST.get('txtDescripcion')
                pais_id=request.POST.get('cboPais')
                FechaInicio = request.POST.get('txtFechainicio')
                FechaFin = request.POST.get('txtFechafin')
                tipoapoyo_id = request.POST.get('cboTipoApoyo')
                Entifin_id = request.POST.get('cboTipoEnFinanciamiento')
                Insntifin_id = request.POST.get('cboTipoInsFinanciamiento')
                tipomoneda_id = request.POST.get('cboTipoMOneda')
                x_resIpen = request.POST.get('txtRespIpen')
                x_resEntidad = request.POST.get('txtRespEnt')
                monto=request.POST.get('txtMonto')
                tipocambio=request.POST.get('txttipoCambio')
                updated_by = request.user
                fecha_actual = timezone.now()
                
                
                x_tipoevento_instance=Tipo_Evento.objects.get(id=tipoevento_id)
                x_areatema_instance=Area_Tematica.objects.get(id=aretematica_id)
                x_pais_instance=Pais.objects.get(id=pais_id)
                x_tipoapoyo_instance=Tipo_Apoyo.objects.get(id=tipoapoyo_id) if tipoapoyo_id else None
                x_Entifina_instance=Entidad_Financiamiento.objects.get(id=Entifin_id) if Entifin_id else None
                x_institufina_instance=Institucion_Financiamiento.objects.get(id=Insntifin_id) if Insntifin_id else None
                x_tipomoneda_instance=Tipo_Moneda.objects.get(id=tipomoneda_id) if tipomoneda_id else None
                
                
                eventoeditado.codigoEvento = codigoevento
                eventoeditado.nomEvento = nombrevento
                eventoeditado.cTipoEvento = x_tipoevento_instance
                eventoeditado.cAreaTem = x_areatema_instance
                eventoeditado.DescEvento = descripcionevento if descripcionevento else None
                eventoeditado.cpais = x_pais_instance
                eventoeditado.fechaInicio = FechaInicio
                eventoeditado.fechaFin = FechaFin if FechaFin else None
                eventoeditado.responsable = x_resIpen
                eventoeditado.responsableEnt = x_resEntidad if x_resEntidad else None
                eventoeditado.cTipoApoyo = x_tipoapoyo_instance
                eventoeditado.cEntFinan = x_Entifina_instance
                eventoeditado.cInstFinanc = x_institufina_instance
                eventoeditado.cTipo_Moneda = x_tipomoneda_instance
                eventoeditado.monto = monto if monto else None
                eventoeditado.tipo_Cambio = tipocambio if tipocambio else None
                eventoeditado.updated_by = updated_by
                eventoeditado.updated = fecha_actual
                
                eventoeditado.save()
                
        return redirect('todosEventos') 
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})


def eliminarEvento(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            idregistro = data.get('idRegistro') 
            with transaction.atomic():
                
                evento = Evento.objects.get(id = idregistro)
                evento.delete()
                
                return JsonResponse({'success':True, 'message': 'Registro eliminado correctamente'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

@login_required
def todosEventos(request):
    todoeventos=Evento.objects.all().order_by('-id')
    Tipo_Eventos=Tipo_Evento.objects.all().order_by('cTipoEvento')
    pais = Pais.objects.all().order_by('cpais')
    TipoApoyo = Tipo_Apoyo.objects.all().order_by('ctipo_apoyo')
    EntFinan = Entidad_Financiamiento.objects.all().order_by('cEntFinancia')
    InsFinan = Institucion_Financiamiento.objects.all().order_by('cInstFinancia')
    TipoMoneda = Tipo_Moneda.objects.all().order_by('cTipo_moneda')
    AreaTem = Area_Tematica.objects.all().order_by('cArea_tematica')
    for te in todoeventos:
        if te.fechaInicio:
            te.fechaInicio = te.fechaInicio.strftime('%d/%m/%Y')
        else:
            te.fechaInicio = 'No especificó'
            
        if te.fechaFin:
            te.fechaFin = te.fechaFin.strftime('%d/%m/%Y')
        else:
            te.fechaFin = 'No especificó'
                
        if te.responsableEnt:
            te.responsableEnt = te.responsableEnt
        else:
           te.responsableEnt = ''
 
    return render(request,'eventos/todoseventos.html',{
        'todoeventos':todoeventos,
        'Tipo_Eventos':Tipo_Eventos,
        'pais': pais,
        'TipoApoyo': TipoApoyo,
        'EntFinan': EntFinan,
        'InsFinan': InsFinan,
        'TipoMoneda': TipoMoneda,
        'AreaTem': AreaTem
    })
    
@login_required   
def get_Evento(request,idEvento):
    try:
        
        eventorequerido = Evento.objects.get(id=idEvento)
        data = {
            'codigoEvento': eventorequerido.codigoEvento,
            'nomEvento': eventorequerido.nomEvento,
            'cTipoEvento_id': eventorequerido.cTipoEvento_id,
            'cAreaTem_id': eventorequerido.cAreaTem_id,
            'DescEvento': eventorequerido.DescEvento,
            'cpais_id': eventorequerido.cpais_id,
            'fechaInicio': eventorequerido.fechaInicio,
            'fechaFin': eventorequerido.fechaFin,
            'cTipoApoyo_id': eventorequerido.cTipoApoyo_id,
            'cEntFinan_id': eventorequerido.cEntFinan_id,
            'cInstFinanc_id': eventorequerido.cInstFinanc_id,
            'RespIPEN': eventorequerido.responsable,
            'RespEntidad': eventorequerido.responsableEnt,
            'cTipo_Moneda_id': eventorequerido.cTipo_Moneda_id,
            'monto': eventorequerido.monto,
            'tipo_Cambio': eventorequerido.tipo_Cambio,
            'created': eventorequerido.created,
            'created_by_id': eventorequerido.created_by_id,
            'updated': eventorequerido.updated,
            'updated_by_id': eventorequerido.updated_by_id,
        }
        
        return JsonResponse({'success': True, 'data': data})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})