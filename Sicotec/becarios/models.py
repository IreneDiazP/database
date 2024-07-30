from django.db import models
from proyectos.models import Pais,Institucion_Financiamiento

# Create your models here.

class Tipo_Documento(models.Model):
    cTipo_documento = models.CharField(
        max_length=50, verbose_name='Tipo de documento')

    def __str__(self):
        return self.cTipo_documento
    
class FormacionAcademica(models.Model):
    formacionacademica = models.CharField(
        max_length=50, verbose_name='formacion academica')

    def __str__(self):
        return self.formacionacademica
    
class Departamento(models.Model):
    departamento = models.CharField(
        max_length=50, verbose_name='formacion academica')

    def __str__(self):
        return self.departamento
    
    
class Provincia(models.Model):
    provincia = models.CharField(
        max_length=50, verbose_name='formacion academica')
    iddepartamento=models.ForeignKey(Departamento,on_delete=models.PROTECT,related_name='Provincia')

    def __str__(self):
        return self.provincia
    
class Distrito(models.Model):
    distrito = models.CharField(
        max_length=50, verbose_name='formacion academica')
    idprovincia=models.ForeignKey(Provincia,on_delete=models.PROTECT,related_name='Distrio')

    def __str__(self):
        return self.distrito
    


class Participante(models.Model):
    PARTICIPANTES_CHOICES=(
        ('EXPERTO'),
        ('PARTICIPANTE')
    )
    PROCEDENCIA_CHOICES=(
        ('EXTERNO'),
        ('INTERNO')
    )
    tipo_participante = models.CharField(
        max_length=20, verbose_name='Código de Proyecto',choices=PARTICIPANTES_CHOICES)
    procedencia = models.CharField(
        max_length=20, verbose_name='Código de Proyecto',choices=PROCEDENCIA_CHOICES)
    nom_participante = models.CharField(
        max_length=100, verbose_name='Nombre de Proyecto')
    apellPate_participante = models.CharField(
        max_length=100, verbose_name='Nombre de Proyecto')
    apellMate_participante = models.CharField(
        max_length=100, verbose_name='Nombre de Proyecto')
    email = models.CharField(
        max_length=100, verbose_name='Nombre de Proyecto')
    cTipo_Documento = models.ForeignKey(
        Tipo_Documento, on_delete=models.PROTECT, verbose_name="Tipo de Dooumento", related_name='Participante')
    numero_documento = models.CharField(
        max_length=100, verbose_name='Nombre de Proyecto')
    telefono = models.CharField(
        max_length=100, verbose_name='Nombre de Proyecto')
    cFormacion_academica = models.ForeignKey(
        FormacionAcademica, on_delete=models.PROTECT, verbose_name="Tipo de Dooumento", related_name='Participante')
    cpais = models.ForeignKey(
        Pais, on_delete=models.PROTECT, verbose_name="País", related_name='proyectos')
    cdepartamento = models.ForeignKey(
        Departamento, on_delete=models.PROTECT, verbose_name="departamento", related_name='participante')
    cprovincia = models.ForeignKey(
        Provincia, on_delete=models.PROTECT, verbose_name="provincia", related_name='participante')
    cdistrito = models.ForeignKey(
        Distrito, on_delete=models.PROTECT, verbose_name="distrito", related_name='participante')
    cInstFinanc = models.ForeignKey(Institucion_Financiamiento, on_delete=models.PROTECT,
                                    verbose_name="Institución de Financiamiento", related_name='proyectos')
    sede = models.CharField(
        max_length=20, verbose_name='Código de Proyecto')
    direccion = models.CharField(
        max_length=20, verbose_name='Código de Proyecto')
    oficina = models.CharField(
        max_length=20, verbose_name='Código de Proyecto')
    