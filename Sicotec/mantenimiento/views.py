import json
from django.shortcuts import render
from django.http import JsonResponse
from proyectos.models import Entidad_Financiamiento,Institucion_Financiamiento

# Create your views here.
def nuevaInstitucion (request):
    Entidades=Entidad_Financiamiento.objects.all().order_by('cEntFinancia')
    
    instituciones=Institucion_Financiamiento.objects.all().order_by('cInstFinancia')

    return render(request,'mantenimiento/nuevainstitucion.html',{
        'Entidades':Entidades,
        'instituciones':instituciones
    })

def getInstitucion(request,idinstitucion):
    try:
        institucion = Institucion_Financiamiento.objects.get(id = idinstitucion)
        datainstitucion={
            'nombreInstitucion':institucion.cInstFinancia,
            'identidad':institucion.entidad_financiamiento.id
        }
        return JsonResponse({'success':True, 'data':datainstitucion })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

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
                getinstitucion = Institucion_Financiamiento.objects.get(id=idInstitucion)
                getinstitucion.cInstFinancia = institucion
                getinstitucion.entidad_financiamiento = Entidad_instance
                getinstitucion.lestado = True
                getinstitucion.save()
                message = 'La institución fue modificada exitosamente'


            instituciones = Institucion_Financiamiento.objects.all().select_related('entidad_financiamiento')

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
        
def eliminarInstituciones (request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            idinstitucion=data.get('idinstitucion')
            institucion = Institucion_Financiamiento.objects.get(id = idinstitucion)
            institucion.delete()
            
            return JsonResponse({'success':True, 'message': 'Institucion eliminado correctamente'})
        except Exception as e:
             return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)