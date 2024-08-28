from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.template.loader import get_template
from becarios.models import Participante
from django.db import connection
from collections import defaultdict
from proyectos.models import Area_Tematica


def reporteproyecto(request):
    areas = Area_Tematica.objects.all().order_by('cArea_tematica')
    return render(request,'reportes/reporteproyectos.html',{
        'areas':areas
    })


def generar_reporte_area(request):
    if request.method == 'POST':
        # año = request.POST.get('Año')
        # area_tematica = request.POST.get('cboAreaTematica')
        año = '2024'
        area_tematica = 1

        # Ejecutar el procedimiento almacenado
        with connection.cursor() as cursor:
            cursor.callproc('sp_report_proy_area', [año, area_tematica])
            results = cursor.fetchall()

        # Procesar los resultados
        datosparticipante = defaultdict(lambda: {'proyectos': []})
        for row in results:
            participante_key = (row[3], row[1], row[2])  # (Nombre, Apellido Paterno, Apellido Materno)
            if participante_key not in datosparticipante:
                datosparticipante[participante_key].update({
                    'NOMBRE': row[3],
                    'APELLIDO_PATERNO': row[1],
                    'APELLIDO_MATERNO': row[2],
                    'PAIS': row[7],
                    'FUENTE_FINANCIAMIENTO': row[8],
                    'proyectos': []
                })
            fecha_inicio = row[4].strftime('%d/%m/%Y') if row[4] else ''
            fecha_fin = row[5].strftime('%d/%m/%Y') if row[5] else ''
            datosparticipante[participante_key]['proyectos'].append({
                'FECHA_INICIO': fecha_inicio,
                'FECHA_FIN': fecha_fin,
                'NOMBRE_PROYECTO': row[6],
                'AUTORIZACION': row[9]
            })

        # Convertir el defaultdict a una lista para el template
        datosparticipante = [
            {
                'NOMBRE': key[0],
                'APELLIDO_PATERNO': key[1],
                'APELLIDO_MATERNO': key[2],
                'PAIS': data['PAIS'],
                'FUENTE_FINANCIAMIENTO': data['FUENTE_FINANCIAMIENTO'],
                'proyectos': data['proyectos']
            }
            for key, data in datosparticipante.items()
        ]

        # Renderizar el template de vista previa con los datos
        html_string = render(request, 'reportes/participantesAñocopy.html', {'datosparticipante': datosparticipante})

        return JsonResponse({'html': html_string.content.decode('utf-8')})

    return JsonResponse({'error': 'Invalid request'}, status=400)