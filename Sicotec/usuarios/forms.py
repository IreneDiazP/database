from django import forms
from django.contrib.auth.models import User
from .models import UserProfile


class UserProfileForm(forms.ModelForm):

    class Meta:
        model = UserProfile
        fields = ['nombre', 'apellido', 'area', 'correo_institucional']
        widgets = {
            'nombre': forms.TextInput(attrs={
                'id': 'txtNombres', 
                'class': 'form-control ', 
            }),
            'apellido': forms.TextInput(attrs={
                'id': 'txtApellidos', 
                'class': 'form-control ', 
                
            }),
            'area': forms.TextInput(attrs={
                'id': 'txtarea', 
                'class': 'form-control ', 
             
            }),
            'correo_institucional': forms.EmailInput(attrs={
                'id': 'txtEmail', 
                'class': 'form-control', 
            })
        }
    username = forms.CharField(max_length=30, widget=forms.TextInput(
        attrs={'id': 'txtUsername','class': 'form-control'}))
    password = forms.CharField(widget=forms.PasswordInput(
        attrs={'id': 'txtContraseña', 'class': 'form-control form-usuario'}))
    
    def __init__(self, *args, **kwargs):
        super(UserProfileForm, self).__init__(*args, **kwargs)
        self.fields['correo_institucional'].required = False
