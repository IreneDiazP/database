from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def nuevobecario(request):
    print('hola')
    return render(request,'proyectos/nuevoproyecto.html')