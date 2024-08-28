import json
from django.http import JsonResponse
from django.shortcuts import render,redirect
from django.contrib import messages
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from usuarios.models import UserProfile
from proyectos.views import Area_Tematica


def login_view(request):
    if request.method == 'POST':
        x_user = request.POST['txtUsuario']
        x_pass = request.POST['txtPassword']
        user = authenticate(request,username = x_user, password = x_pass)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
                        
            messages.error(request, 'Credenciales inválidas. Intente nuevamente.')
            return render(request,'core/login.html')
    else:
        return render(request,'core/login.html')



    
@login_required
def home(request):
    user = request.user
    usuario= UserProfile.objects.get(user_id = user.id)
    print('el usuario es ')
    print(usuario.nombre)
    print(usuario.debe_cambiar_contraseña)

    return render(request, 'core/home.html',{
        'usuario':usuario
    })

@login_required
def cambiopassword(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')

            if new_password != confirm_password:
                return JsonResponse({'success': False, 'message': 'Las contraseñas no coinciden'})
            
            request.user.set_password(new_password)
            request.user.userprofile.debe_cambiar_contraseña = False
            request.user.userprofile.save()
            request.user.save()

            return JsonResponse({'success': True, 'message': 'La contraseña fue actualizada', 'redirect': ''})
        
        except Exception as e:
            # Manejo de errores y excepción inesperada
            return JsonResponse({'success': False, 'message': f'Error: {str(e)}'}, status=500)
    
    # Respuesta para métodos distintos a POST
    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)




def salir(request):
    logout(request)
    return redirect('/')