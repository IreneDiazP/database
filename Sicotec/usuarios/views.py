import json
from django.contrib import messages
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import transaction
from .models import UserProfile
from .forms import UserProfileForm

@login_required
def nuevo_usuario(request):
    usuario = UserProfile.objects.all().order_by('-created')
    print(usuario)
    form = UserProfileForm()
    return render(request, 'usuarios/nuevousuario.html',{
        'usuario':usuario,
        'profile_form': form
    })

@login_required
def getusuario(request, idusuario):
    try:
        print('holi boli')
        usuario = UserProfile.objects.get(id=idusuario)
        dataUsuario = {
            'nombre': usuario.nombre,
            'apellido': usuario.apellido,
            'area': usuario.area,
            'email':usuario.correo_institucional,
            'usuario': usuario.user.username,
           
        }
        return JsonResponse({'success': True, 'data': dataUsuario})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})
    

def agregarusuario(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        idusuario = data.get('idusuario')
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        area = data.get('area')
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        is_active = data.get('is_active', True)  # Capturando el valor de is_active

        try:
            with transaction.atomic():
                if not idusuario:
                    # Crear un nuevo usuario
                    user = User.objects.create_user(username=username, password=password)
                    user.is_active = is_active  # Establecer si el usuario está activo o no
                    user.save()
                    
                    profile = UserProfile(
                        user=user,
                        nombre=nombre,
                        apellido=apellido,
                        area=area,
                        correo_institucional=email if email else None,
                        created_by=request.user
                    )
                    profile.save()
                    message = 'Usuario creado exitosamente'
                else:
                    # Actualizar un usuario existente
                    profile = UserProfile.objects.get(id=idusuario)
                    user = profile.user  # Obtener el usuario asociado al perfil

                    if username:
                        user.username = username
                    if password:
                        user.set_password(password)  # Cambiar la contraseña
                    user.is_active = is_active  # Actualizar el estado activo del usuario
                    user.save()

                    profile.nombre = nombre
                    profile.apellido = apellido
                    profile.area = area
                    profile.correo_institucional = email if email else None
                    profile.updated_by = request.user
                    profile.save()

                    message = 'Usuario actualizado exitosamente'

                usuarios = UserProfile.objects.all().order_by('-created')
                usuarios_list = [
                    {
                        'id': u.id,
                        'nombre': u.nombre,
                        'apellido': u.apellido,
                        'area': u.area,
                        'usuario': u.user.username,
                        'is_active': u.user.is_active

                    }
                    for u in usuarios
                ]

                return JsonResponse({'success': True, 'message': message, 'data': usuarios_list})
        
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)

