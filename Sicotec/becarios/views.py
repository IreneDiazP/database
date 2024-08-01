from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Departamento,Provincia,Distrito,Participante,Tipo_Documento,FormacionAcademica

from proyectos.models import Pais,Institucion_Financiamiento,Sede
# Create your views here.
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
def editarparticipante(request):
    print('hola de editar participante')
    return render(request,'becarios/editarparticipante.html')

@login_required
def todosparticipantes (request):
    print('hola desde todos participantes')
    return render(request,'becarios/todosparticipantes.html')
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


#traer sedes de acuerdo a la institucion
@login_required
def getSede (request, idinstitucion):
    print('hola sede')
    print(idinstitucion)
    sede = Sede.objects.filter(institucion_financiamiento_id = idinstitucion).order_by('nombre_sede')
    print(sede)
    data= list(sede.values('id','nombre_sede'))
    return JsonResponse(data, safe=False)


@login_required
def getdatosSede(request, idsede):
    print('hola dato de sede id')
    print(idsede)
    datossede = get_object_or_404(Sede, id=idsede)
    print(datossede)
    
    sede_data = {
        'id': datossede.id,
        'nombre': datossede.nombre_sede, 
        'direccion': datossede.direccion_sede,
        'oficina':datossede.oficina_sede
    }
    
    return JsonResponse(sede_data)