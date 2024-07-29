from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Create your views here.
@login_required
def nuevoParticipante(request):
    print('hola')
    return render(request,'becarios/nuevobecario.html')

def editarparticipante(request):
    print('hola de editar participante')
    return render(request,'becarios/editarparticipante.html')

def todosparticipantes (request):
    print('hola desde todos participantes')
    return render(request,'becarios/todosparticipantes.html')