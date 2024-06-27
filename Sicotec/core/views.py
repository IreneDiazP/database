from django.shortcuts import render,redirect
from django.contrib.auth import authenticate,login,logout

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
            print('error')
            return render(request='core/login.html')
    else:
        return render(request,'core/login.html')