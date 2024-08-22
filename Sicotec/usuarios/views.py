from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import transaction
from .models import UserProfile
from .forms import UserProfileForm

@login_required
def nuevo_usuario(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST)
        if form.is_valid():
            try:
                with transaction.atomic():
                    # Obtener los datos del formulario
                    username = form.cleaned_data['username']
                    password = form.cleaned_data['password']
                    nombre = form.cleaned_data['nombre']
                    apellido = form.cleaned_data['apellido']
                    area = form.cleaned_data['area']
                    correo_institucional = form.cleaned_data['correo_institucional']

                    # Crear el usuario
                    user = User.objects.create_user(username=username, password=password)

                    # Crear el perfil del usuario
                    profile = UserProfile(
                        user=user,
                        nombre=nombre,
                        apellido=apellido,
                        area=area,
                        correo_institucional=correo_institucional if correo_institucional else None,
                        created_by=request.user
                    )
                    profile.save()

                    messages.success(request, 'Usuario creado exitosamente')
                    return redirect('nuevoUsuario')
            except Exception as e:
                messages.error(request, f'Hubo un problema al crear el usuario: {str(e)}')
        else:
            messages.error(request, 'Formulario inválido. Por favor, revise los datos ingresados.')
    else:
        form = UserProfileForm()

    return render(request, 'usuarios/nuevousuario.html', {'profile_form': form})

