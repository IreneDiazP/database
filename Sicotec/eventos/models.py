from django.db import models
from proyectos.models import Area_Tematica, Pais, Tipo_Apoyo, Entidad_Financiamiento, Institucion_Financiamiento, Tipo_Moneda
from django.contrib.auth.models import User

# Create your models here.
class Tipo_Evento(models.Model):
    cTipoEvento = models.CharField(
        max_length=50, verbose_name='Tipo_Evento', unique=True)

    def __str__(self):
        return self.cTipoEvento

class Evento(models.Model):
    codigoEvento = models.CharField(max_length=100, verbose_name='Codigo_Evento')
    nomEvento = models.CharField(max_length=100, verbose_name='Nombre_Evento')
    cTipoEvento = models.ForeignKey(Tipo_Evento, on_delete=models.PROTECT, verbose_name="Tipo_Evento")
    cAreaTem = models.ForeignKey(Area_Tematica, on_delete=models.PROTECT, verbose_name="Área_Temática", related_name='Eventos')
    DescEvento = models.CharField(max_length=300, verbose_name='Descripción_Evento', null=True , blank=True)
    cpais = models.ForeignKey(Pais, on_delete=models.PROTECT, verbose_name="País_Eventos", related_name='Eventos')
    fechaInicio = models.DateField(verbose_name='Fecha_Inicio_Evento')
    fechaFin = models.DateField(verbose_name='Fecha_Fin_Evento', null=True , blank=True)
    responsable = models.CharField(max_length=100, verbose_name='Responsable IPEN' )
    responsableEnt = models.CharField(max_length=100, verbose_name='Responsable Entidad', null=True , blank=True)
    cTipoApoyo = models.ForeignKey(Tipo_Apoyo, on_delete=models.PROTECT, verbose_name="Tipo_Apoyo", related_name='Eventos' , null=True , blank=True)
    cEntFinan = models.ForeignKey(Entidad_Financiamiento, on_delete=models.PROTECT, verbose_name="Entidad_Financiamiento", related_name='Eventos' , null=True , blank=True)
    cInstFinanc = models.ForeignKey(Institucion_Financiamiento, on_delete=models.PROTECT, verbose_name="Institución_Financiamiento", related_name='Eventos' , null=True , blank=True)
    cTipo_Moneda = models.ForeignKey(Tipo_Moneda, on_delete=models.PROTECT, verbose_name="Tipo_Moneda", related_name='Eventos' , null=True , blank=True)
    monto = models.DecimalField(max_digits=15, decimal_places=4, verbose_name='Monto', null=True , blank=True)
    tipo_Cambio = models.DecimalField(max_digits=6, decimal_places=3, verbose_name='Tipo de Cambio', null=True , blank=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="Evento_created_by", verbose_name="Creado por")
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    updated_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="Evento_updated_by", verbose_name="Modificado por", null=True)
    updated = models.DateTimeField(auto_now=True, verbose_name="Fecha de Edición")

    class Meta:
        verbose_name = 'Evento'
        verbose_name_plural = 'Eventos'
        ordering = ['-created']
        
    def __str__(self):
        return self.nomEvento
