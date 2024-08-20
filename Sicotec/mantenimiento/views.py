import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from proyectos.models import Entidad_Financiamiento, Institucion_Financiamiento

# Create your views here.


@login_required
def nuevaInstitucion(request):
    Entidades = Entidad_Financiamiento.objects.all().order_by('cEntFinancia')

    instituciones = Institucion_Financiamiento.objects.all().order_by('cInstFinancia')

    return render(request, 'mantenimiento/nuevainstitucion.html', {
        'Entidades': Entidades,
        'instituciones': instituciones
    })


@login_required
def getInstitucion(request, idinstitucion):
    try:
        institucion = Institucion_Financiamiento.objects.get(id=idinstitucion)
        datainstitucion = {
            'nombreInstitucion': institucion.cInstFinancia,
            'identidad': institucion.entidad_financiamiento.id
        }
        return JsonResponse({'success': True, 'data': datainstitucion})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})


@login_required
def editarinstitucion(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            idInstitucion = data.get('idinstitucion')
            Entidad = data.get('Entidad')
            institucion = data.get('institucion')

            Entidad_instance = Entidad_Financiamiento.objects.get(id=Entidad)

            if not idInstitucion:
                nuevaInstitucion = Institucion_Financiamiento(
                    cInstFinancia=institucion,
                    entidad_financiamiento=Entidad_instance,
                    lestado=True
                )
                nuevaInstitucion.save()
                message = 'La institución fue registrada exitosamente'
            else:
                getinstitucion = Institucion_Financiamiento.objects.get(
                    id=idInstitucion)
                getinstitucion.cInstFinancia = institucion
                getinstitucion.entidad_financiamiento = Entidad_instance
                getinstitucion.lestado = True
                getinstitucion.save()
                message = 'La institución fue modificada exitosamente'

            instituciones = Institucion_Financiamiento.objects.all(
            ).select_related('entidad_financiamiento')

            instituciones_list = [
                {
                    'id': inst.id,
                    'entidad_financiamiento': inst.entidad_financiamiento.cEntFinancia,
                    'cInstFinancia': inst.cInstFinancia,
                } for inst in instituciones
            ]

            return JsonResponse({'success': True, 'message': message, 'data': instituciones_list})

        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)


@login_required
def eliminarInstituciones(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            idinstitucion = data.get('idinstitucion')
            institucion = Institucion_Financiamiento.objects.get(
                id=idinstitucion)
            institucion.delete()

            return JsonResponse({'success': True, 'message': 'Institucion eliminado correctamente'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)


@login_required
def añadirnuevoentidad(request):
    Entidades = Entidad_Financiamiento.objects.all().order_by('cEntFinancia')

    return render(request, 'mantenimiento/nuevoEntidad.html', {
        'Entidades': Entidades,
    })

@login_required
def getEntidad(request, identidad):
    try:
        print('holi boli')
        Entidad = Entidad_Financiamiento.objects.get(id=identidad)
        datainstitucion = {
            'nombreEntidad': Entidad.cEntFinancia,
           
        }
        return JsonResponse({'success': True, 'data': datainstitucion})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})



@login_required
def editarentidad(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            idEntidad = data.get('idEntidad')
            NUevaEntidad = data.get('Entidad')


            if not idEntidad:
                nuevaentidad = Entidad_Financiamiento(
                    cEntFinancia=NUevaEntidad,
                    lestado=True
                )
                nuevaentidad.save()
                message = 'La Entidad fue registrada exitosamente'
            else:
                getEntidad = Entidad_Financiamiento.objects.get(
                    id=idEntidad)
                getEntidad.cEntFinancia = NUevaEntidad
                getEntidad.lestado = True
                getEntidad.save()
                message = 'La Entidad fue modificada exitosamente'

            Entidades = Entidad_Financiamiento.objects.all().order_by('cEntFinancia')

            entidades_list = [
                {
                    'id': enti.id,
                    'entidad_financiamiento': enti.cEntFinancia,
                } for enti in Entidades
            ]

            return JsonResponse({'success': True, 'message': message, 'data': entidades_list})

        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)
        
@login_required
def eliminarEntidad(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            idEntidad = data.get('idEntidad')
            entidad = Entidad_Financiamiento.objects.get(
                id=idEntidad)
            entidad.delete()

            return JsonResponse({'success': True, 'message': 'Institucion eliminado correctamente'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)
