from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from.forms import  UserProfileForm

# Create your views here.
@login_required
def nuevo_usuario(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = User.objects.create_user(username=username, password=password)
            profile = form.save(commit=False)
            profile.user = user
            profile.save()
    else:
        form = UserProfileForm()
    
    return render(request, 'usuarios/nuevousuario.html', {'profile_form': form})
