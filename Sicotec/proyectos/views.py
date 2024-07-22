from django.shortcuts import render
from django.http import JsonResponse
import json
from django.contrib.auth.decorators import login_required
from .models import Pais, Tipo_Proyecto, Entidad_Financiamiento, Institucion_Financiamiento, Tipo_Apoyo, Area_Tematica, Tipo_Moneda, Proyecto
from django.core.exceptions import ObjectDoesNotExist


@login_required
def nuevoproyecto(request):
    tipoProyec = Tipo_Proyecto.objects.all().order_by('cTipoProyecto')
    pais = Pais.objects.all().order_by('cpais')
    TipoApoyo = Tipo_Apoyo.objects.all().order_by('ctipo_apoyo')
    EntFinan = Entidad_Financiamiento.objects.all().order_by('cEntFinancia')
    InsFinan = Institucion_Financiamiento.objects.all().order_by('cInstFinancia')
    TipoMoneda = Tipo_Moneda.objects.all().order_by('cTipo_moneda')
    AreaTem = Area_Tematica.objects.all().order_by('cArea_tematica')
    return render(request, 'proyectos/nuevoproyecto.html', {
        'tipoProyec': tipoProyec,
        'pais': pais,
        'TipoApoyo': TipoApoyo,
        'EntFinan': EntFinan,
        'InsFinan': InsFinan,
        'TipoMoneda': TipoMoneda,
        'AreaTem': AreaTem
    })


@login_required
def registrarProyecto(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))

            x_tipo_proyec = data.get('cboTipoProyecto')
            x_cod_proyec = data.get('txtCodigoProyecto')
            x_nom_proyect = data.get('txtNombreProyecto')
            x_des_proyect = data.get('txtDescripcion')
            x_pais = data.get('cboPais')
            x_tipo_apoyo = data.get('cboTipoApoyo')
            x_entfinan = data.get('cboTipoEnFinanciamiento')
            x_instfinan = data.get('cboTipoInsFinanciamiento')
            x_tipo_moneda = data.get('cboTipoMOneda')
            x_monto = data.get('txtMonto')
            x_tipo_cambio = data.get('txttipoCambio')
            x_respIpen = data.get('txtRespIpen')
            x_respEnt = data.get('txtRespEnt')
            x_area_tem = data.get('cboAreaTematica')
            x_fechaIn = data.get('txtFechaInicio')
            x_fechaFin = data.get('txtFechaFin')
            x_created_by = request.user

            print(f"Tipo Proyecto: {x_tipo_proyec}")
            print(f"Pais: {x_pais}")
            print(f"Tipo Apoyo: {x_tipo_apoyo}")
            print(f"Entidad Financiamiento: {x_entfinan}")
            print(f"Institucion Financiamiento: {x_instfinan}")
            print(f"Tipo Moneda: {x_tipo_moneda}")
            print(f"Area Tematica: {x_area_tem}")

            tipo_proyec_instance = Tipo_Proyecto.objects.get(id=x_tipo_proyec)
            pais_instance = Pais.objects.get(id=x_pais)
            tipo_apoyo_instance = Tipo_Apoyo.objects.get(id=x_tipo_apoyo)
            entfinan_instance = Entidad_Financiamiento.objects.get(
                id=x_entfinan)
            instfinan_instance = Institucion_Financiamiento.objects.get(
                id=x_instfinan)
            tipo_moneda_instance = Tipo_Moneda.objects.get(id=x_tipo_moneda)
            area_tem_instance = Area_Tematica.objects.get(id=x_area_tem)

            proyectonuevo = Proyecto(
                cTipo_proyecto=tipo_proyec_instance,
                codigoProyecto=x_cod_proyec,
                nomProyecto=x_nom_proyect,
                DescProyecto=x_des_proyect,
                cpais=pais_instance,
                cTipoApoyo=tipo_apoyo_instance,
                cEntFinan=entfinan_instance,
                cInstFinanc=instfinan_instance,
                cTipo_Moneda=tipo_moneda_instance,
                monto=x_monto,
                tipo_Cambio=x_tipo_cambio,
                responsable=x_respIpen,
                responsableEnt=x_respEnt,
                cAreaTem=area_tem_instance,
                fechaInicio=x_fechaIn,
                fechaFin=x_fechaFin,
                created_by=x_created_by
            )

            proyectonuevo.save()
            return JsonResponse({'success': True, 'message': 'Proyecto registrado correctamente'})

        except ObjectDoesNotExist as e:
            return JsonResponse({'success': False, 'message': f'Error al registrar el proyecto: {str(e)}'}, status=500)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error inesperado: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


@login_required
def todosProyectos(request):
    tproyectos = Proyecto.objects.all()
    for pr in tproyectos:
        pr.fechaInicio = pr.fechaInicio.strftime('%d/%m/%Y')
        pr.fechaFin = pr.fechaFin.strftime('%d/%m/%Y')
        pr.totalsoles=pr.tipo_Cambio*pr.monto
            
    return render(request, 'proyectos/todosProyectos.html', {
        'tproyectos': tproyectos
    })

#obtener instituciones segun entidad
@login_required
def getInstituciones(request, entidad_id):
    instituciones = Institucion_Financiamiento.objects.filter(entidad_financiamiento_id=entidad_id)
    data = list(instituciones.values('id', 'cInstFinancia'))
    return JsonResponse(data, safe=False)