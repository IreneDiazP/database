from django.shortcuts import render,redirect
from django.contrib import messages
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required


# Create your views here.

def login_view(request):
    if request.method == 'POST':
        x_user = request.POST['txtUsuario']
        x_pass = request.POST['txtPassword']
        user = authenticate(request,username = x_user, password = x_pass)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
                        # Manejar errores de inicio de sesión+
            messages.error(request, 'Credenciales inválidas. Intente nuevamente.')
            return render(request,'core/login.html')
    else:
        return render(request,'core/login.html')
    
@login_required(login_url='/')
def home(request):
    return render(request, 'core/home.html')


def salir(request):
    logout(request)
    return redirect('/')