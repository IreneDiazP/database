from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Create your views here.
@login_required
def nuevoevento(request):
    print('hola llama')
    return render(request,'eventos/nuevoevento.html')