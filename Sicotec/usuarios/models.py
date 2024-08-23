from django.db import models 
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, verbose_name="Usuario")
    nombre = models.CharField(max_length=100, verbose_name='Nombre')
    apellido = models.CharField(max_length=150, verbose_name='Apellido')
    area = models.CharField(max_length=100, verbose_name='area')
    correo_institucional = models.EmailField(max_length=254, unique=True, verbose_name='Correo Institucional', null=True,  blank=True)
    debe_cambiar_contraseña = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, related_name='userprofiles_created', on_delete=models.PROTECT, verbose_name="Creado por")
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_by = models.ForeignKey(User, related_name='userprofiles_updated', on_delete=models.PROTECT, verbose_name="Modificado por", null=True)
    updated = models.DateTimeField(auto_now=True, verbose_name="Fecha de edición")
        
    class Meta:
        verbose_name = 'Perfil de usuario'
        verbose_name_plural = 'Perfiles de usuario'
        ordering = ['-created']
        
    def __str__(self):
        return self.user.username
