from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import UserProfile
from.forms import  UserProfileForm

@login_required
def nuevo_usuario(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST)
        if form.is_valid():
            # Obtener los datos del formulario
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            nombre = form.cleaned_data['nombre']
            apellido = form.cleaned_data['apellido']
            area = form.cleaned_data['area']
            correo_institucional = form.cleaned_data['correo_institucional']

            user = User.objects.create_user(username=username, password=password)

         
            profile = UserProfile(
                user=user,
                nombre=nombre,
                apellido=apellido,
                area=area,
                correo_institucional=correo_institucional,
                created_by=request.user  
            )
            profile.save()


    else:
        form = UserProfileForm()
    
    return render(request, 'usuarios/nuevousuario.html', {'profile_form': form})
