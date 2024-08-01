from django.db import models
from proyectos.models import Pais,Institucion_Financiamiento
from proyectos.models import Proyecto
from eventos.models import Evento
from django.contrib.auth.models import User


class Departamento(models.Model):
    departamento = models.CharField(max_length=50, verbose_name='Departamento')
    def __str__(self):
        return self.departamento
    
class Provincia(models.Model):
    provincia = models.CharField(max_length=50, verbose_name='Provincia')
    departamento = models.ForeignKey(Departamento, on_delete=models.PROTECT, related_name='provincias')

    def __str__(self):
        return self.provincia
    
class Distrito(models.Model):
    distrito = models.CharField(max_length=50, verbose_name='Distrito')
    provincia = models.ForeignKey(Provincia, on_delete=models.PROTECT, related_name='distritos')

    def __str__(self):
        return self.distrito


class Tipo_Documento(models.Model):
    Tipo_documento = models.CharField(
        max_length=50, verbose_name='Tipo de documento')

    def __str__(self):
        return self.Tipo_documento
    
class FormacionAcademica(models.Model):
    nombre_formacionacademica = models.CharField(
        max_length=100, verbose_name='formacion academica')

    def __str__(self):
        return self.nombre_formacionacademica

class Becas(models.Model):
    nombre_beca = models.CharField(
        max_length=100, verbose_name='nombre beca')
    descripcion_beca = models.CharField(
        max_length=250, verbose_name='descripcion beca')

    def __str__(self):
        return self.nombre_beca



class Participante(models.Model):
    PARTICIPANTE_CHOICES = (
        ('EXPERTO', 'EXPERTO'),
        ('PARTICIPANTE', 'PARTICIPANTE'),
    )
    
    PROCEDENCIA_CHOICES = (
        ('EXTERNO', 'EXTERNO'),
        ('INTERNO', 'INTERNO'),
    )
    tipo_participante = models.CharField(
        max_length=20, verbose_name='tipo participante',choices=PARTICIPANTE_CHOICES)
    procedencia = models.CharField(
        max_length=20, verbose_name='tipo procedencia',choices=PROCEDENCIA_CHOICES)
    nom_participante = models.CharField(
        max_length=100, verbose_name='Nombre participante')
    apellPate_participante = models.CharField(
        max_length=100, verbose_name='apellido paterno participante')
    apellMate_participante = models.CharField(
        max_length=100, verbose_name='apellido materno participante')
    email = models.EmailField(verbose_name='Email', null=True, blank=True)
    cTipo_Documento = models.ForeignKey(
        Tipo_Documento, on_delete=models.PROTECT, verbose_name="Tipo de Documento", related_name='Participantes')
    numero_documento = models.CharField(
        max_length=50, verbose_name='Numero documento')
    telefono = models.CharField(
        max_length=30, verbose_name='telefono', null=True, blank=True)
    cFormacion_academica = models.ForeignKey(
        FormacionAcademica, on_delete=models.PROTECT, verbose_name="formacion academica", related_name='Participantes', null=True, blank=True)
    cpais = models.ForeignKey(
        Pais, on_delete=models.PROTECT, verbose_name="País", related_name='Participantes')
    cdepartamento = models.ForeignKey(
        Departamento, on_delete=models.PROTECT, verbose_name="departamento", related_name='Participantes', null=True, blank=True)
    cprovincia = models.ForeignKey(
        Provincia, on_delete=models.PROTECT, verbose_name="provincia", related_name='Participantes', null=True, blank=True)
    cdistrito = models.ForeignKey(
        Distrito, on_delete=models.PROTECT, verbose_name="distrito", related_name='Participantes', null=True, blank=True)
    ciudad = models.CharField(
        max_length=100, verbose_name='ciudad', null=True, blank=True)  
    cbeca = models.ForeignKey(Becas,on_delete=models.PROTECT,verbose_name= "beca", related_name="Participantes", null=True, blank=True)
    cInstFinanc = models.ForeignKey(Institucion_Financiamiento, on_delete=models.PROTECT,
                                    verbose_name="Institución de Financiamiento", related_name='Participantes', null=True, blank=True)
    proyecto = models.ForeignKey(
        Proyecto, on_delete=models.CASCADE, verbose_name="Proyecto", related_name='Participantes', null=True, blank=True)
    evento = models.ForeignKey(
        Evento, on_delete=models.CASCADE, verbose_name="evento", related_name='Participantes', null=True, blank=True)
    estado=models.BooleanField(default=True, verbose_name="estado")
    
    created_by = models.ForeignKey(User, on_delete=models.PROTECT,
                                   related_name="Participantes_created_by", verbose_name="Creado por")
    created = models.DateTimeField(
        auto_now_add=True, verbose_name="Fecha de Creación")
    updated_by = models.ForeignKey(User, on_delete=models.PROTECT,
                                   related_name="Participantes_updated_by", verbose_name="Modificado por", null=True)
    updated = models.DateTimeField(
        auto_now=True, verbose_name="Fecha de Edición")
    
    class Meta:
        verbose_name = "Participante"
        verbose_name_plural = "Participantes"

    def __str__(self):
        return self.nom_participante
    