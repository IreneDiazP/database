from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Departamento,Provincia,Distrito,Participante,Tipo_Documento,FormacionAcademica

from proyectos.models import Pais,Institucion_Financiamiento
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

def getProvincias (request, iddepartamento):
    provincia=Provincia.objects.filter(departamento_id=iddepartamento).order_by('provincia')
    data= list(provincia.values('id','provincia'))
    return JsonResponse(data, safe=False)

def getDistrito (request, idprovincia):
    distrito = Distrito.objects.filter(provincia_id=idprovincia).order_by('distrito')
    data= list(distrito.values('id','distrito'))
    return JsonResponse(data, safe=False)