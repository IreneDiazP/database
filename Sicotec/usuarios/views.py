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

def agregarusuario(request):
    if request.method == 'POST':
        data= json.loads(request.body)
        nombre=data.get('nombre')
        apellido=data.get('apellido')
        area=data.get('area')
        email=data.get('email')
        username=data.get('username')
        password=data.get('password')
        try:
            with transaction.atomic():
            
                user = User.objects.create_user(username=username, password=password)
                profile = UserProfile(
                    user=user,
                    nombre=nombre,
                    apellido=apellido,
                    area=area,
                    correo_institucional= email if email else None,
                    created_by=request.user
                    )
                profile.save()
                

                usuarios = UserProfile.objects.all().order_by('-created')
                usuarios_list = [
                    {
                        'id':u.id,
                        'nombre': u.nombre,
                        'apellido': u.apellido,
                        'area': u.area,
                        'usuario': u.user.username
                    }
                    for u in usuarios
                ]


                return JsonResponse({'success': True, 'message': 'Usuario creado exitosamente' , 'data':usuarios_list})
            
         
        except Exception as e:
                return JsonResponse({'success': False, 'message': f'Error en los datos recibidos: {str(e)}'}, status=400)


