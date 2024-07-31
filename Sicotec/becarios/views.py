from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Departamento,Provincia,Distrito
# Create your views here.
@login_required
def nuevoParticipante(request):
    
    departamentos=Departamento.objects.all().order_by('departamento')
    print(departamentos)
    
    return render(request,'becarios/nuevobecario.html',{
        'departamentos':departamentos
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