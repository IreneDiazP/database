from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from django.views.decorators.http import require_POST
import json
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from .models import Departamento,Provincia,Distrito,Participante,Tipo_Documento,FormacionAcademica,Det_EventoProyecto
from eventos.models import Evento,Tipo_Evento

from proyectos.models import Pais,Institucion_Financiamiento,Sede,Entidad_Financiamiento,Tipo_Moneda,Area_Tematica,Proyecto,Tipo_Proyecto,Tipo_Apoyo



@login_required
def nuevoParticipante(request):

    tipo_participante_choices = Participante.PARTICIPANTE_CHOICES
    procedencia_choices = Participante.PROCEDENCIA_CHOICES
    tipoDocumento = Tipo_Documento.objects.all().order_by('Tipo_documento')
    formacionacademica=FormacionAcademica.objects.all().order_by('nombre_formacionacademica')
    pais=Pais.objects.all().order_by('cpais')
    departamentos=Departamento.objects.all().order_by('departamento')
    institucion=Institucion_Financiamiento.objects.all().order_by('cInstFinancia')
    
    return render(request,'becarios/nuevobecario.html',{
        'tipo_participante_choices': tipo_participante_choices,
        'procedencia_choices': procedencia_choices,
        'tipoDocumento':tipoDocumento,
        'formacionacademica':formacionacademica,
        'pais':pais,
        'departamentos':departamentos,
        'institucion':institucion
    })
    


@login_required
def registrarParticpante(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            #traer datos           
            x_tipoparticipante = data.get('tipoParticipante')
            x_procedencia = data.get('procedencia')
            x_nombres = data.get('nombres')
            x_apellidoPaterno = data.get('apellidoPaterno')
            x_apellidoMaterno = data.get('apellidoMaterno')
            x_email = data.get('email')
            x_tipoDocumento = data.get('tipoDocumento')
            x_documento = data.get('documento')
            x_telefono = data.get('telefono')
            x_formacionAcademica = data.get('formacionAcademica')
            x_pais = data.get('pais')
            x_ciudad = data.get('ciudad')
            x_departamento = data.get('departamento') or None
            x_provincia = data.get('provincia') or None
            x_distrito = data.get('distrito') or None
            x_institucion = data.get('institucion')
            x_sede = data.get('sede')
            x_direccionSede = data.get('direccionSede')
            x_oficina = data.get('doficina')
            x_created_by = request.user
            
                # Instancias
            tipodocumento_instancia = Tipo_Documento.objects.get(id=x_tipoDocumento)
            formacionacademica_instancia = FormacionAcademica.objects.get(id=x_formacionAcademica) if  x_formacionAcademica else None
            pais_instancia = Pais.objects.get(id=x_pais)
            
            # Manejar campos nulos o vacíos
            departamento_instancia = Departamento.objects.get(id=x_departamento) if x_departamento else None
            provincia_instancia = Provincia.objects.get(id=x_provincia) if x_provincia else None
            distrito_instancia = Distrito.objects.get(id=x_distrito) if x_distrito else None
            institucion_instancia = Institucion_Financiamiento.objects.get(id=x_institucion)
            
            
            regisrarsede, created = Sede.objects.get_or_create(
                nombre_sede=x_sede if x_sede else None, 
                direccion_sede=x_direccionSede if x_direccionSede else None,
                oficina_sede=x_oficina if x_oficina else None,
                institucion_financiamiento=institucion_instancia
            )
            
            participantenuevo=Participante(
                tipo_participante = x_tipoparticipante,
                procedencia = x_procedencia,
                nom_participante = x_nombres,
                apellPate_participante = x_apellidoPaterno,
                apellMate_participante = x_apellidoMaterno,
                email = x_email if x_email else None ,
                cTipo_Documento = tipodocumento_instancia,
                numero_documento = x_documento,
                telefono = x_telefono if x_telefono else None,
                cFormacion_academica = formacionacademica_instancia,
                cpais = pais_instancia,
                cdepartamento = departamento_instancia,
                cprovincia = provincia_instancia,
                cdistrito = distrito_instancia,
                ciudad = x_ciudad,
                sede=regisrarsede,
                created_by=x_created_by
            )
            
            participantenuevo.save()
            
            return JsonResponse({'success': True, 'message': 'Participante registrado correctamente'})
        except ObjectDoesNotExist as e :   
            return JsonResponse({'success': False, 'message': f'Error al registrar el Participante: {str(e)}'}, status=500)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error inesperado: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

@login_required
def actualizarParticipante(request):
    if request.method == 'POST':
        
        try:

            data = json.loads(request.body)

            for item in data.get('changes', []):
                participante_id = item.get('id')
                tipo_procedencia = item.get('procedencia')
                estado = item.get('estado')
                

                try:
                    participante = Participante.objects.get(id=participante_id)
                    
                    if tipo_procedencia:
                        participante.procedencia = tipo_procedencia  
                    if estado is not None:
                        participante.estado = estado
                    participante.save()
                except Participante.DoesNotExist:
                    continue
            
            # datos actualizados para la tabla
            participantes = Participante.objects.all().values(
                'id', 'nom_participante', 'apellPate_participante', 'apellMate_participante',
                'tipo_participante', 'procedencia', 'estado', 'sede__institucion_financiamiento__cInstFinancia'
            )

            return JsonResponse({'status': 'success', 'participantes': list(participantes)})

        except json.JSONDecodeError:
            
            return JsonResponse({'status': 'error', 'message': 'Datos JSON inválidos'}, status=400)

    return JsonResponse({'status': 'error'}, status=400)
    

@login_required
def editarparticipante(request,idparticipante):
    participante = Participante.objects.get(id=idparticipante)
    todosEventos = Evento.objects.all()
    Tipo_Eventos=Tipo_Evento.objects.all().order_by('cTipoEvento')

    TipoApoyo = Tipo_Apoyo.objects.all().order_by('ctipo_apoyo')
    EntFinan = Entidad_Financiamiento.objects.all().order_by('cEntFinancia')
    TipoMoneda = Tipo_Moneda.objects.all().order_by('cTipo_moneda')
    AreaTem = Area_Tematica.objects.all().order_by('cArea_tematica')
    tipo_participante_choices = Participante.PARTICIPANTE_CHOICES
    procedencia_choices = Participante.PROCEDENCIA_CHOICES
    tipoDocumento = Tipo_Documento.objects.all().order_by('Tipo_documento')
    
    TodoProyectos = Proyecto.objects.all().order_by('nomProyecto')
    tipoProyecto = Tipo_Proyecto.objects.all()
    formacionacademica=FormacionAcademica.objects.all().order_by('nombre_formacionacademica')
    pais=Pais.objects.all().order_by('cpais')
   
    departamentos=Departamento.objects.all().order_by('departamento')
    institucion=Institucion_Financiamiento.objects.all().order_by('cInstFinancia')
    
    # Obtener los proyectos y eventos asociados al participante
    proyectos = participante.proyectos.all()
    eventos = participante.eventos.all()
    
    for pr in proyectos:
        if pr.fechaInicio:
            pr.fechaInicio = pr.fechaInicio.strftime('%d/%m/%Y')
        else:
            pr.fechaInicio = 'No especificada' 
            
        if pr.fechaFin:
            pr.fechaFin = pr.fechaFin.strftime('%d/%m/%Y')
        else:
            pr.fechaFin = 'No especificada'  
            
        if pr.responsableEnt:
            pr.responsable = pr.responsableEnt
        else:
            pr.responsableEnt=''
    

    return render(request,'becarios/editarparticipante.html',{
        'tipo_participante_choices': tipo_participante_choices,
        'procedencia_choices': procedencia_choices,
        'tipoDocumento':tipoDocumento,
        'formacionacademica':formacionacademica,
        'pais':pais,
        'departamentos':departamentos,
        'institucion':institucion,
        'proyectos':proyectos,
        'TodoProyectos':TodoProyectos,
        'eventos':eventos,
        'todosEventos':todosEventos,
        'Tipo_Eventos':Tipo_Eventos,
        'TipoApoyo':TipoApoyo,
        'EntFinan':EntFinan,
        'TipoMoneda':TipoMoneda,
        'AreaTem':AreaTem,
        'tipoProyecto':tipoProyecto
    })



@login_required
def todosparticipantes (request):
    participantes=Participante.objects.all().select_related('sede__institucion_financiamiento')

    return render(request,'becarios/todosparticipantes.html',{
        'participantes':participantes
    })

@login_required
@require_POST
def getdatosparticipante(request):
    try:
        data = json.loads(request.body)
        idparticipante = data.get('participanteidId')
        participante = Participante.objects.get(id=idparticipante)
        
        sede_data = {}
        if participante.sede:
            sede_data = {
            'nombre_sede': participante.sede.nombre_sede,
            'direccion_sede': participante.sede.direccion_sede,
            'oficina_sede': participante.sede.oficina_sede,
            'institucion_financiamiento':participante.sede.institucion_financiamiento.id,
            'idparticipantesede':participante.sede.id
            }
        
        
        response_data = {
            'success': True,
            'data': {
                'id': participante.id,
                'nom_participante': participante.nom_participante,
                'apellPate_participante': participante.apellPate_participante,
                'apellMate_participante': participante.apellMate_participante,
                'email': participante.email,
                'tipo_participante': participante.tipo_participante,
                'tipo_documento':participante.cTipo_Documento.id if participante.cTipo_Documento else '',
                'procedencia': participante.procedencia,
                'numero_documento': participante.numero_documento,
                'telefono': participante.telefono,
                'cFormacion_academica': participante.cFormacion_academica.id if participante.cFormacion_academica else '',
                'cpais': participante.cpais.id ,
                'cdepartamento': participante.cdepartamento.id if participante.cdepartamento else '',
                'cprovincia': participante.cprovincia.id if participante.cprovincia else '',
                'cdistrito': participante.cdistrito.id if participante.cdistrito else '',
                'ciudad': participante.ciudad,
                'cbeca': participante.cbeca.id if participante.cbeca else '',
                'proyectos': [proyecto.id for proyecto in participante.proyectos.all()],
                'eventos': [evento.id for evento in participante.eventos.all()],
                'sede': sede_data,
                'estado': participante.estado
            }
        }
        return JsonResponse(response_data)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Error en los datos recibidos'}, status=400)
    except Participante.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Participante no encontrado'}, status=404)
    except Exception as e:
        # Captura cualquier otra excepción y devuelve un error genérico
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@login_required
def getProvincias (request, iddepartamento):
    provincia=Provincia.objects.filter(departamento_id=iddepartamento).order_by('provincia')
    data= list(provincia.values('id','provincia'))
    return JsonResponse(data, safe=False)




@login_required
def getDistrito (request, idprovincia):
    distrito = Distrito.objects.filter(provincia_id=idprovincia).order_by('distrito')
    data= list(distrito.values('id','distrito'))
    return JsonResponse(data, safe=False)


@login_required   
def get_Evento(request,idEvento):
    try:
       
        eventorequerido = Evento.objects.get(id=idEvento)
        data = {
            'idevento':idEvento,
            'codigoEvento': eventorequerido.codigoEvento,
            'nomEvento': eventorequerido.nomEvento,
            'cTipoEvento_id': eventorequerido.cTipoEvento_id,
            'cAreaTem_id': eventorequerido.cAreaTem_id,
            'DescEvento': eventorequerido.DescEvento,
            'cpais_id': eventorequerido.cpais.id,
            'fechaInicio': eventorequerido.fechaInicio,
            'fechaFin': eventorequerido.fechaFin,
            'cTipoApoyo_id': eventorequerido.cTipoApoyo_id,
            'cEntFinan_id': eventorequerido.cEntFinan_id,
            'cInstFinanc_id': eventorequerido.cInstFinanc_id,
            'cTipo_Moneda_id': eventorequerido.cTipo_Moneda_id,
            'monto': eventorequerido.monto,
            'tipo_Cambio': eventorequerido.tipo_Cambio,
            'responsableIpen': eventorequerido.responsable,
            'responsableentidad': eventorequerido.responsableEnt,
            'created': eventorequerido.created,
            'created_by_id': eventorequerido.created_by_id,
            'updated': eventorequerido.updated,
            'updated_by_id': eventorequerido.updated_by_id,
        }
        
        return JsonResponse({'success': True, 'data': data})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})
    

@login_required       
def añadireventoproyecto(request):

    if request.method == 'POST':
        try:
            with transaction.atomic():
                data = json.loads(request.body)

                # Obtener valores del body enviado desde JS
                x_idevento = data.get('idevento')
                x_idproyecto = data.get('idproyecto')
                x_CodigoEvento = data.get('CodigoEvento')
                x_NombreEvento = data.get('NombreEvento')
                x_TipoEvento = data.get('TipoEvento')
                x_AreaTematica = data.get('AreaTematica')
                x_DescripcionEvento = data.get('DescripcionEvento')
                x_PaisEvento = data.get('PaisEvento')
                x_Fechainicio = data.get('Fechainicio')
                x_Fechafin = data.get('Fechafin')
                x_TipoApoyo = data.get('TipoApoyo')
                x_TipoEnFinanciamiento = data.get('TipoEnFinanciamiento')
                TipoInsFinanciamiento = data.get('TipoInsFinanciamiento')
                x_TipoMOneda = data.get('TipoMOneda')
                x_Monto = data.get('Monto')
                x_TipoCambio = data.get('TipoCambio')
                x_Codigo_autorizacion = data.get('Codigo_autorizacion')
                x_Codigo_acta = data.get('Codigo_acta')
                x_Compromiso = data.get('Compromiso')
                x_Objetivo = data.get('Objetivo')
                x_Informe = data.get('Informe')
                x_Observacion = data.get('Observacion')
                x_Actividad = data.get('Actividad')
                x_idparticipante = data.get('idparticipante')
                x_iddetalleeventoproyecto = data.get('iddetalleeventoproyecto')
                x_resIpen = data.get('responsableipen')
                x_resEntidad = data.get('responsableentidad')

                
                updated_by = request.user
                fecha_actual = timezone.now()
                
                # Instancias
                eventoeditado = Evento.objects.get(id=x_idevento)
                
                x_tipoevento_instance = Tipo_Evento.objects.get(id=x_TipoEvento)
                x_areatema_instance = Area_Tematica.objects.get(id=x_AreaTematica)
                x_pais_instance = Pais.objects.get(id=x_PaisEvento)
                x_tipoapoyo_instance = Tipo_Apoyo.objects.get(id=x_TipoApoyo) if x_TipoApoyo else None
                x_Entifina_instance = Entidad_Financiamiento.objects.get(id=x_TipoEnFinanciamiento) if x_TipoEnFinanciamiento else None
                x_institufina_instance = Institucion_Financiamiento.objects.get(id=TipoInsFinanciamiento) if TipoInsFinanciamiento else None
                x_tipomoneda_instance = Tipo_Moneda.objects.get(id=x_TipoMOneda) if x_TipoMOneda else None
                
                x_idproyecto_instance = Proyecto.objects.get(id=x_idproyecto) if x_idproyecto else None
                x_idparticipante_instance = Participante.objects.get(id=x_idparticipante) if x_idparticipante else None
                
                # Actualizar evento
                eventoeditado.codigoEvento = x_CodigoEvento
                eventoeditado.nomEvento = x_NombreEvento
                eventoeditado.cTipoEvento = x_tipoevento_instance
                eventoeditado.cAreaTem = x_areatema_instance
                eventoeditado.DescEvento = x_DescripcionEvento  if x_DescripcionEvento else None
                eventoeditado.cpais = x_pais_instance
                eventoeditado.fechaInicio = x_Fechainicio
                eventoeditado.fechaFin = x_Fechafin if x_Fechafin else None
                eventoeditado.responsable = x_resIpen
                eventoeditado.responsableEnt = x_resEntidad if x_resEntidad else None
                eventoeditado.cTipoApoyo = x_tipoapoyo_instance
                eventoeditado.cEntFinan = x_Entifina_instance
                eventoeditado.cInstFinanc = x_institufina_instance
                eventoeditado.cTipo_Moneda = x_tipomoneda_instance
                eventoeditado.monto = x_Monto if x_Monto else None
                eventoeditado.tipo_Cambio = x_TipoCambio if x_TipoCambio else None
                eventoeditado.updated_by = updated_by
                eventoeditado.updated = fecha_actual
                
                # cargar datos a  Det_EventoProyecto
                if not x_iddetalleeventoproyecto:
                    verificarsiexiste=Det_EventoProyecto.objects.filter(participante_id = x_idparticipante_instance, evento_id = eventoeditado).exists()
                    if verificarsiexiste:
                        return JsonResponse({'success': False, 'message': 'Este evento ya se encuentra vinculado con este participante.'}, status=400)
                    else:
                        detalle_evento_proyecto = Det_EventoProyecto()
                else:
                    detalle_evento_proyecto = get_object_or_404(Det_EventoProyecto, id=x_iddetalleeventoproyecto)
                
                detalle_evento_proyecto.participante = x_idparticipante_instance
                detalle_evento_proyecto.proyecto = x_idproyecto_instance
                detalle_evento_proyecto.evento = eventoeditado
                detalle_evento_proyecto.Cod_autorizacion = x_Codigo_autorizacion
                detalle_evento_proyecto.Cod_acta = x_Codigo_acta
                
                # Manejo para los archivos 
                if 'Autorizacion' in request.FILES:
                    detalle_evento_proyecto.Autorizacion = request.FILES['Autorizacion']
                if 'acta' in request.FILES:
                    detalle_evento_proyecto.acta = request.FILES['acta']
                
                detalle_evento_proyecto.Compromiso = x_Compromiso
                detalle_evento_proyecto.Objetivo = x_Objetivo
                detalle_evento_proyecto.Informe = x_Informe
                detalle_evento_proyecto.Observacion = x_Observacion
                detalle_evento_proyecto.actividad = x_Actividad
                
                detalle_evento_proyecto.created_by = updated_by
                detalle_evento_proyecto.updated_by = updated_by
                
                # Guardar evento y detalle
                eventoeditado.save()
                detalle_evento_proyecto.save()
                
                # Añadir evento al participante
                participante = get_object_or_404(Participante, id=x_idparticipante_instance.id)
                if eventoeditado not in participante.eventos.all():
                    participante.eventos.add(eventoeditado)
                    participante.save()
                    print(f"Evento con ID {x_idevento} añadido al participante con ID {x_idparticipante_instance.id}.")
                else:
                    print(f"El evento con ID {x_idevento} ya está asociado al participante con ID {x_idparticipante_instance.id}.")
                
                # Obtener eventos actualizados del participante
                eventosparticipantesdata = []
                for evento in participante.eventos.all():
                    eventosparticipantesdata.append({
                        'id': evento.id,
                        'nombrevento': evento.nomEvento,
                        'codigoevento': evento.codigoEvento,
                        'tipoevento': evento.cTipoEvento.cTipoEvento  # Cambiado a ID
                    })
                
            return JsonResponse({'success': True,'message': 'Proyecto registrado correctamente', 'eventos': eventosparticipantesdata})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Error en los datos recibidos'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

@login_required

def modificarparticipante(request, idparticipante):
    if request.method == 'POST':
        participante = Participante.objects.get(id=idparticipante)
        data = json.loads(request.body)
        x_tipoparticipante = data.get('tipoparticipante')
        x_procedencia = data.get('procedencia')
        x_nombre = data.get('nombreparticipante')
        x_apellidopaterno = data.get('apellidopaterno')
        x_apellidomaterno = data.get('apellidomaterno')
        x_email = data.get('correoelectronico')
        x_tipodocumento = data.get('tipodocumento')
        x_numerodocumento = data.get('numerodocumento')
        x_telefono = data.get('telefono')
        x_formacionacademica = data.get('formacionacademica')
        x_pais = data.get('pais')
        x_ciudad = data.get('ciudad')
        x_departamento = data.get('departamento')
        x_provincia = data.get('provincia')
        x_distrito = data.get('distrito')
        x_institucion = data.get('institucion')
        x_sede = data.get('sede')
        x_direccion = data.get('direccion')
        x_oficina = data.get('oficina')
        idsede = data.get('idsede')
        updated_by = request.user
        fecha_actual = timezone.now()
        
        print(x_sede)
        
        try:
            with transaction.atomic():
                # Instancias
                x_tipodocumento_instance = Tipo_Documento.objects.get(id=x_tipodocumento)
                x_formacionacademica_instance = FormacionAcademica.objects.get(id=x_formacionacademica)
                x_pais_instance = Pais.objects.get(id=x_pais)
                x_departamento_instance = Departamento.objects.get(id=x_departamento) if x_departamento else None
                x_provincia_instance = Provincia.objects.get(id=x_provincia) if x_provincia else None
                x_distrito_instance = Distrito.objects.get(id=x_distrito) if x_distrito else None
                x_institucion_instance = Institucion_Financiamiento.objects.get(id=x_institucion)
                
                # Actualización de Participante
                participante.tipo_participante = x_tipoparticipante
                participante.procedencia = x_procedencia
                participante.nom_participante = x_nombre
                participante.apellPate_participante = x_apellidopaterno
                participante.apellMate_participante = x_apellidomaterno
                participante.email = x_email
                participante.cTipo_Documento = x_tipodocumento_instance
                participante.numero_documento = x_numerodocumento
                participante.telefono = x_telefono
                participante.cFormacion_academica = x_formacionacademica_instance
                participante.cpais = x_pais_instance
                participante.cdepartamento = x_departamento_instance
                participante.cprovincia = x_provincia_instance
                participante.cdistrito = x_distrito_instance
                participante.ciudad = x_ciudad
                participante.estado = True
                participante.updated_by = updated_by
                participante.updated = fecha_actual
                
                
                if idsede:
                    try:
                        if participante.sede:
                            sede_instance = Sede.objects.get(id=participante.sede.id)
                            sede_instance.nombre_sede = x_sede if x_sede else None
                            sede_instance.direccion_sede = x_direccion if x_direccion else None
                            sede_instance.oficina_sede = x_oficina if x_oficina else None
                            sede_instance.institucion_financiamiento = x_institucion_instance
                            sede_instance.save()
                        else:
                            raise Sede.DoesNotExist
                    except Sede.DoesNotExist:
                        sede_instance = Sede(
                            nombre_sede=x_sede if x_sede else None,
                            direccion_sede=x_direccion if x_direccion else None,
                            oficina_sede=x_oficina if x_oficina else None,
                            institucion_financiamiento=x_institucion_instance
                        )
                        sede_instance.save()
                    
                    participante.sede = sede_instance
                
                participante.save()
                
                    
                
                participante_data = {
                    'id': participante.id,
                    'tipoparticipante': participante.tipo_participante,
                    'procedencia': participante.procedencia,
                    'nombreparticipante': participante.nom_participante,
                    'apellidopaterno': participante.apellPate_participante,
                    'apellidomaterno': participante.apellMate_participante,
                    'correoelectronico': participante.email,
                    'tipodocumento': participante.cTipo_Documento.id,
                    'numerodocumento': participante.numero_documento,
                    'telefono': participante.telefono,
                    'formacionacademica': participante.cFormacion_academica.id,
                    'pais': participante.cpais.id,
                    'ciudad': participante.ciudad,
                    'departamento': participante.cdepartamento.id if participante.cdepartamento else None,
                    'provincia': participante.cprovincia.id if participante.cprovincia else None,
                    'distrito': participante.cdistrito.id if participante.cdistrito else None,
                    'institucion': participante.sede.institucion_financiamiento.id if participante.sede else None,
                    'sede': participante.sede.nombre_sede if participante.sede else None,
                    'direccion': participante.sede.direccion_sede if participante.sede else None,
                    'oficina': participante.sede.oficina_sede if participante.sede else None,
                    'idsede': participante.sede.id,

                }
                return JsonResponse({'success': True, 'message': 'Los datos del participante fueron actualizados correctamente', 'data': participante_data})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)
        
    return JsonResponse({'success': False, 'message': 'Método de solicitud no permitido'}, status=400)

@login_required
def editareventoparticipante(request, idevento,idparticipante):
    if request.method == 'GET':
        try:
            with transaction.atomic():
                eventoparticipante=Evento.objects.get(id =idevento)
                
                try:
                    detalleeventoparticipante = Det_EventoProyecto.objects.get(participante_id=idparticipante, evento_id=idevento)                
                except Det_EventoProyecto.DoesNotExist:
                    detalleeventoparticipante = None
                
                eventoparticipante_data = {
                'idevento': eventoparticipante.id,
                'codigoevento':eventoparticipante.codigoEvento,
                'nombrevento':eventoparticipante.nomEvento,
                'tipoevento':eventoparticipante.cTipoEvento.id,
                'areatematica':eventoparticipante.cAreaTem.id,
                'descripcion':eventoparticipante.DescEvento if eventoparticipante else None ,
                'pais':eventoparticipante.cpais.id,
                'fechainicio':eventoparticipante.fechaInicio,
                'fechafin':eventoparticipante.fechaFin if eventoparticipante else None,
                'responsableIpen': eventoparticipante.responsable,
                'responsableentidad': eventoparticipante.responsableEnt,
                'tipoapoyo':eventoparticipante.cTipoApoyo.id if eventoparticipante.cTipoApoyo else None,
                'entidadfinanciamiento':eventoparticipante.cEntFinan.id if eventoparticipante.cEntFinan else None ,
                'institucionfinanciamiento':eventoparticipante.cInstFinanc.id if eventoparticipante.cInstFinanc else None,
                'tipomoneda':eventoparticipante.cTipo_Moneda.id if eventoparticipante.cTipo_Moneda else None,
                'monto': str(eventoparticipante.monto) if eventoparticipante else None,  # Serializar Decimal como cadena
                'tipocambio': str(eventoparticipante.tipo_Cambio) if eventoparticipante else None,
                'iddetalle':detalleeventoparticipante.id if detalleeventoparticipante else None,
                'codigoautorizacion':detalleeventoparticipante.Cod_autorizacion if detalleeventoparticipante else None,
                'codigoacta':detalleeventoparticipante.Cod_acta if detalleeventoparticipante else None,
                'compromiso':detalleeventoparticipante.Compromiso if detalleeventoparticipante else None,
                'objetivo':detalleeventoparticipante.Objetivo if detalleeventoparticipante else None,
                'informe':detalleeventoparticipante.Informe if detalleeventoparticipante else None,
                'observacion':detalleeventoparticipante.Observacion if detalleeventoparticipante else None,
                'actividad':detalleeventoparticipante.actividad if detalleeventoparticipante else None,
                 
                }
                
                return JsonResponse({'success':True, 'eventoparticipante':eventoparticipante_data})
        except Exception as e:    
            return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)
        
    return JsonResponse({'success': False, 'message': 'Método de solicitud no permitido'}, status=400)

@login_required
def eliminareventoparticipante (request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            idevento=data.get('idevento')
            idparticipante = data.get('idparticipante')
            with transaction.atomic():
                
                participante = Participante.objects.get(id=idparticipante)

                ideventoeliminar = Evento.objects.get(id = idevento )
                
                iddetalleeventoeliminar = Det_EventoProyecto.objects.get(evento_id = idevento, participante_id= idparticipante )
                
                iddetalleeventoeliminar.delete()
                
                participante.eventos.remove(ideventoeliminar)
                
                return JsonResponse({'success':True, 'message': 'El evento vinculado a este participante fue eliminado exitosamente'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)
    return JsonResponse({'success': False, 'message': 'Método de solicitud no permitido'}, status=400)


@login_required   
def getProyectoParticipante(request,idproyecto):
    try:
       
        Proyectorequerido = Proyecto.objects.get(id=idproyecto)
        data = {
            'idproyecto':idproyecto,
            'TipoProyecto': Proyectorequerido.cTipo_proyecto_id,
            'CodigoProyecto': Proyectorequerido.codigoProyecto,
            'NombreProyecto': Proyectorequerido.nomProyecto,
            'DescProyecto': Proyectorequerido.DescProyecto,
            'PaisProyecto': Proyectorequerido.cpais_id,
            'TipoApoyo': Proyectorequerido.cTipoApoyo_id,
            'EntidadFina': Proyectorequerido.cEntFinan_id,
            'InstittucionFina': Proyectorequerido.cInstFinanc_id,
            'TipoMoneda': Proyectorequerido.cTipo_Moneda_id,
            'monto': Proyectorequerido.monto,
            'TipoCambio': Proyectorequerido.tipo_Cambio,
            'Responsable': Proyectorequerido.responsable,
            'ResponsableEntidad': Proyectorequerido.responsableEnt,
            'AreaTematica': Proyectorequerido.cAreaTem_id,
            'FechaInicio': Proyectorequerido.fechaInicio,
            'FechaFin': Proyectorequerido.fechaFin,
        }
        return JsonResponse({'success': True, 'data': data})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})
    

@login_required   
def añadirproyectoparticipante(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        x_tipoProyecto = data.get('tipoProyecto')
        x_CodigoProyecto = data.get('CodigoProyecto')
        x_NombreProyecto = data.get('NombreProyecto')
        x_descripcionProyecto = data.get('descripcionProyecto')
        x_pais = data.get('pais')
        x_tipoApoyo = data.get('tipoApoyo')
        x_EntidadFinanciamiento = data.get('tipoFinanciamiento')
        x_InstittucionFinanciamiento = data.get('InstittucionFinanciamiento')
        x_tipoMoneda = data.get('tipoMoneda')
        x_Monto = data.get('Monto')
        x_TipoCambio = data.get('TipoCambio')
        x_responsableIpen = data.get('responsableIpen')
        x_responsableEntidad = data.get('responsableEntidad')
        x_areaTematica = data.get('areaTematica')
        x_fechaInicio = data.get('fechaInicio')
        x_fechaFin = data.get('fechaFin')
        x_codigoautorizacion = data.get('codigoautorizacion')
        x_codigoActa = data.get('codigoActa')
        x_compromiso = data.get('compromiso')
        x_objetivo = data.get('objetivo')
        x_informe = data.get('informe')
        x_observacion = data.get('observacion')
        x_actividad = data.get('actividad')
        x_idparticipante = data.get('idparticipante')
        x_idproyecto = data.get('idproyecto')
        x_iddetalleproyecto = data.get('iddetalleproyecto')
        updated_by = request.user
        fecha_actual = timezone.now()
        print('el id pryecto es: ')
        print(x_idproyecto)
        
        
        try:
            with transaction.atomic():
                  #INSTANCIAS
                x_tipoProyecto_instance = Tipo_Proyecto.objects.get(id = x_tipoProyecto)
                x_pais_instance = Pais.objects.get(id = x_pais)
                x_tipoApoyo_instance = Tipo_Apoyo.objects.get(id = x_tipoApoyo) if x_tipoApoyo else None
                x_EntidadFinanciamiento_instance = Entidad_Financiamiento.objects.get(id = x_EntidadFinanciamiento) if x_EntidadFinanciamiento else None
                
                x_InstittucionFinanciamiento_instance = Institucion_Financiamiento.objects.get(id = x_InstittucionFinanciamiento)if x_InstittucionFinanciamiento else None
                x_tipoMoneda_instance = Tipo_Moneda.objects.get(id = x_tipoMoneda)if x_tipoMoneda else None
                x_areaTematica_instance = Area_Tematica.objects.get(id = x_areaTematica)
                x_idparticipante_instance = Participante.objects.get(id=x_idparticipante) if x_idparticipante else None
                
                #OBTENEMOS EL PROYECTO
                editproyecto = Proyecto.objects.get(id = x_idproyecto)
                #AHORA CAMBIAREMOS SUS VALORES
                editproyecto.cTipo_proyecto = x_tipoProyecto_instance
                editproyecto.codigoProyecto = x_CodigoProyecto
                editproyecto.nomProyecto = x_NombreProyecto
                editproyecto.DescProyecto = x_descripcionProyecto or None
                editproyecto.cpais = x_pais_instance
                editproyecto.cTipoApoyo = x_tipoApoyo_instance
                editproyecto.cEntFinan = x_EntidadFinanciamiento_instance
                editproyecto.cInstFinanc = x_InstittucionFinanciamiento_instance
                editproyecto.cTipo_Moneda = x_tipoMoneda_instance
                editproyecto.monto = x_Monto or None
                editproyecto.tipo_Cambio = x_TipoCambio or None
                editproyecto.responsable = x_responsableIpen
                editproyecto.responsableEnt = x_responsableEntidad or None
                editproyecto.cAreaTem = x_areaTematica_instance
                editproyecto.fechaInicio = x_fechaInicio or None
                editproyecto.fechaFin = x_fechaFin or None
                editproyecto.updated_by = updated_by


                
                
                # cargar datos a  Det_EventoProyecto
                if not x_iddetalleproyecto:
                    verificarsiexiste=Det_EventoProyecto.objects.filter(participante_id = x_idparticipante_instance, proyecto_id = editproyecto).exists()
                    if verificarsiexiste:
                        return JsonResponse({'success': False, 'message': 'Este Proyecto ya se encuentra vinculado con este participante.'}, status=400)
                    else:
                        detalle_proyecto_participante = Det_EventoProyecto()
                else:
                    detalle_proyecto_participante = get_object_or_404(Det_EventoProyecto, id =x_iddetalleproyecto)
                
                detalle_proyecto_participante.participante = x_idparticipante_instance
                detalle_proyecto_participante.proyecto = editproyecto
                detalle_proyecto_participante.evento = None
                detalle_proyecto_participante.Cod_autorizacion = x_codigoautorizacion
                detalle_proyecto_participante.Cod_acta = x_codigoActa
                
                # Manejo para los archivos 
                if 'Autorizacion' in request.FILES:
                    detalle_proyecto_participante.Autorizacion = request.FILES['Autorizacion']
                if 'acta' in request.FILES:
                    detalle_proyecto_participante.acta = request.FILES['acta']
                
                detalle_proyecto_participante.Compromiso = x_compromiso
                detalle_proyecto_participante.Objetivo = x_objetivo
                detalle_proyecto_participante.Informe = x_informe
                detalle_proyecto_participante.Observacion = x_observacion
                detalle_proyecto_participante.actividad = x_actividad
                
                detalle_proyecto_participante.created_by = updated_by
                detalle_proyecto_participante.updated_by = updated_by
                
                # Guardar evento y detalle
                editproyecto.save()
                detalle_proyecto_participante.save()
                
                # Añadir evento al participante
                participante = get_object_or_404(Participante, id=x_idparticipante_instance.id)
                if editproyecto not in participante.proyectos.all():
                    participante.proyectos.add(editproyecto)
                    participante.save()
                    print(f"Evento con ID {x_idproyecto} añadido al participante con ID {x_idparticipante_instance.id}.")
                else:
                    print(f"El evento con ID {x_idproyecto} ya está asociado al participante con ID {x_idparticipante_instance.id}.")
                
                # Obtener eventos actualizados del participante
                Proyectoparticipantesdata = []
                for proyecto in participante.proyectos.all():
                    Proyectoparticipantesdata.append({
                        'id': proyecto.id,
                        'codigoProyecto': proyecto.codigoProyecto,
                        'nomProyecto': proyecto.nomProyecto,
                        'responsableEnt': proyecto.responsableEnt if proyecto.responsableEnt else '',  # Cambiado a ID
                        'cAreaTem': proyecto.cAreaTem.cArea_tematica ,
                        'fechaInicio': proyecto.fechaInicio.strftime('%Y-%m-%d') if proyecto.fechaInicio else 'no especifico',
                        'fechaFin': proyecto.fechaFin.strftime('%Y-%m-%d') if proyecto.fechaFin else 'no especifico',

                    })

                return JsonResponse({'success': True,'message': 'Proyecto registrado correctamente', 'data': Proyectoparticipantesdata})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Error en los datos recibidos'}, status=400)
        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse({'success': False, 'message': str(e)}, status=500)


def editarproyectoparticipante(request,idproyecto,idparticipante):
    if request.method == 'GET':
        try:
            with transaction.atomic():
                proyectoparticipante=Proyecto.objects.get(id =idproyecto)
                
                try:
                    detalleproyectoparticipante = Det_EventoProyecto.objects.get(participante_id=idparticipante, proyecto_id=idproyecto)
                except Det_EventoProyecto.DoesNotExist:
                    detalleproyectoparticipante = None
                
                print(proyectoparticipante)
                print(detalleproyectoparticipante)
                
                
                proyectoParticipante_data = {
                'idproyecto': proyectoparticipante.id,
                'tipoProyecto': proyectoparticipante.cTipo_proyecto.id,
                'codigoProyecto':proyectoparticipante.codigoProyecto,
                'nombreproyecto':proyectoparticipante.nomProyecto,
                'descripcionProyecto':proyectoparticipante.DescProyecto,
                'pais':proyectoparticipante.cpais.id,
                'tipoApoyo':proyectoparticipante.cTipoApoyo.id if proyectoparticipante.cTipoApoyo else None ,
                'EntiFinanciamiento':proyectoparticipante.cEntFinan.id if proyectoparticipante.cEntFinan else None,
                'InstiFinanciamiento':proyectoparticipante.cInstFinanc.id if proyectoparticipante.cInstFinanc else None,
                'tipoMoneda':proyectoparticipante.cTipo_Moneda.id if proyectoparticipante.cTipo_Moneda else None,
                'monto':str(proyectoparticipante.monto),
                'tipoCambio':str(proyectoparticipante.tipo_Cambio),
                'ResponsableIpen':proyectoparticipante.responsable,
                'Responsableentidad':proyectoparticipante.responsableEnt,
                'areatematica': str(proyectoparticipante.cAreaTem.id) if proyectoparticipante.cAreaTem else None,
                'fechainicio':proyectoparticipante.fechaInicio,
                'fechafin':proyectoparticipante.fechaFin,
                'codautorizacion': detalleproyectoparticipante.Cod_autorizacion if detalleproyectoparticipante else None,
                'codigoacta': detalleproyectoparticipante.Cod_acta if detalleproyectoparticipante else None,
                'compromiso': detalleproyectoparticipante.Compromiso if detalleproyectoparticipante else None,
                'objetivo': detalleproyectoparticipante.Objetivo if detalleproyectoparticipante else None,
                'informe': detalleproyectoparticipante.Informe if detalleproyectoparticipante else None,
                'observacion': detalleproyectoparticipante.Observacion if detalleproyectoparticipante else None,
                'actividad': detalleproyectoparticipante.actividad if detalleproyectoparticipante else None,
                'iddetalleproyecto': detalleproyectoparticipante.id if detalleproyectoparticipante else None
                }
                
                
                return JsonResponse({'success':True, 'proyectoparticipante':proyectoParticipante_data})
        except Exception as e:    
            return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)
        
    return JsonResponse({'success': False, 'message': 'Método de solicitud no permitido'}, status=400)


@login_required
def eliminarproyectoparticipante (request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            idproyecto=data.get('idproyecto')
            idparticipante = data.get('idparticipante')
            print(idproyecto)
            print(idparticipante)
            with transaction.atomic():
                
                participante = Participante.objects.get(id=idparticipante)

                idproyectoeliminar = Proyecto.objects.get(id = idproyecto )
                
                iddetalleproyectoeliminar = Det_EventoProyecto.objects.get(proyecto_id = idproyecto, participante_id= idparticipante )
                
                iddetalleproyectoeliminar.delete()
                
                participante.proyectos.remove(idproyectoeliminar)
                
                return JsonResponse({'success':True, 'message': 'El proyecto vinculado a este participante fue eliminado exitosamente'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)
    return JsonResponse({'success': False, 'message': 'Método de solicitud no permitido'}, status=400)
