from django.db import models
from django.contrib.auth.models import User


class Pais(models.Model):
    cpais = models.CharField(max_length=50, verbose_name='País', unique=True)

    def __str__(self):
        return self.cpais


class Tipo_Proyecto(models.Model):
    cTipoProyecto = models.CharField(
        max_length=50, verbose_name='Tipo de Proyecto', unique=True)

    def __str__(self):
        return self.cTipoProyecto


class Entidad_Financiamiento(models.Model):
    cEntFinancia = models.CharField(
        max_length=100, verbose_name='Entidad de Financiamiento', unique=True)
    lestado = models.BooleanField(default=True, verbose_name="Estado")

    def __str__(self):
        return self.cEntFinancia


class Institucion_Financiamiento(models.Model):
    cInstFinancia = models.CharField(
        max_length=100, verbose_name='Institución de Financiamiento', unique=True)
    entidad_financiamiento = models.ForeignKey(
        Entidad_Financiamiento, on_delete=models.PROTECT, related_name='instituciones')
    lestado = models.BooleanField(default=True, verbose_name="Estado")

    def __str__(self):
        return f'{self.cInstFinancia} ({self.entidad_financiamiento})'


class Tipo_Apoyo(models.Model):
    ctipo_apoyo = models.CharField(max_length=50, verbose_name='Tipo de Apoyo')

    def __str__(self):
        return self.ctipo_apoyo


class Area_Tematica(models.Model):
    cArea_tematica = models.CharField(
        max_length=100, verbose_name='Área Temática')

    def __str__(self):
        return self.cArea_tematica


class Tipo_Moneda(models.Model):
    cTipo_moneda = models.CharField(
        max_length=50, verbose_name='Tipo de Moneda')

    def __str__(self):
        return self.cTipo_moneda


class Proyecto(models.Model):
    cTipo_proyecto = models.ForeignKey(
        Tipo_Proyecto, on_delete=models.PROTECT, verbose_name="Tipo de Proyecto", related_name='proyectos')
    codigoProyecto = models.CharField(
        max_length=20, verbose_name='Código de Proyecto')
    nomProyecto = models.CharField(
        max_length=100, verbose_name='Nombre de Proyecto')
    DescProyecto = models.CharField(
        max_length=300, verbose_name='Descripción de Proyecto')
    cpais = models.ForeignKey(
        Pais, on_delete=models.PROTECT, verbose_name="País", related_name='proyectos')
    cTipoApoyo = models.ForeignKey(
        Tipo_Apoyo, on_delete=models.PROTECT, verbose_name="Tipo de Apoyo", related_name='proyectos')
    cEntFinan = models.ForeignKey(Entidad_Financiamiento, on_delete=models.PROTECT,
                                  verbose_name="Entidad de Financiamiento", related_name='proyectos')
    cInstFinanc = models.ForeignKey(Institucion_Financiamiento, on_delete=models.PROTECT,
                                    verbose_name="Institución de Financiamiento", related_name='proyectos')
    cTipo_Moneda = models.ForeignKey(
        Tipo_Moneda, on_delete=models.PROTECT, verbose_name="Tipo de Moneda", related_name='proyectos')
    monto = models.DecimalField(
        max_digits=15, decimal_places=4, verbose_name='Monto', null=True)
    tipo_Cambio = models.DecimalField(
        max_digits=6, decimal_places=3, verbose_name='Tipo de Cambio', null=True)
    responsable = models.CharField(
        max_length=100, verbose_name='Responsable IPEN')
    responsableEnt = models.CharField(
        max_length=100, verbose_name='Responsable Entidad', null=True)
    cAreaTem = models.ForeignKey(Area_Tematica, on_delete=models.PROTECT,
                                 verbose_name="Área Temática", related_name='proyectos')
    fechaInicio = models.DateField(verbose_name='Fecha de Inicio')
    fechaFin = models.DateField(verbose_name='Fecha Fin')

    created_by = models.ForeignKey(User, on_delete=models.PROTECT,
                                   related_name="proyecto_created_by", verbose_name="Creado por")
    created = models.DateTimeField(
        auto_now_add=True, verbose_name="Fecha de Creación")
    updated_by = models.ForeignKey(User, on_delete=models.PROTECT,
                                   related_name="proyecto_updated_by", verbose_name="Modificado por", null=True)
    updated = models.DateTimeField(
        auto_now=True, verbose_name="Fecha de Edición")

    def __str__(self):
        return self.nomProyecto
