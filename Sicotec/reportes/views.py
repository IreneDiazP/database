from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.template.loader import get_template
from becarios.models import Participante
from django.db import connection
from collections import defaultdict
from proyectos.models import Area_Tematica
from datetime import datetime


def reporteproyecto(request):
    areas = Area_Tematica.objects.all().order_by('cArea_tematica')
    return render(request, 'reportes/reporteproyectos.html', {
        'areas': areas
    })


def generar_reporte_area(request):
    if request.method == 'POST':
        año = request.POST.get('Año')
        area_tematica = request.POST.get('cboAreaTematica')

        if area_tematica:
            nombrearetematica = Area_Tematica.objects.get(id=area_tematica)
            print(nombrearetematica.cArea_tematica)
            lista_area_tematica = [nombrearetematica.cArea_tematica]
        else:
            lista_area_tematica = []

        año = año if año else None
        area_tematica = area_tematica if area_tematica else None
        print(f"Año: {año}, Área Temática: {area_tematica}")

        with connection.cursor() as cursor:
            cursor.callproc('sp_report_proy_area', [area_tematica, año])
            results = cursor.fetchall()

        datosparticipante = defaultdict(lambda: {'proyectos': []})

        for row in results:
            participante_id = row[1]
            if participante_id not in datosparticipante:

                datosparticipante[participante_id].update({
                    'NOMBRE': row[4],
                    'APELLIDO_PATERNO': row[2],
                    'APELLIDO_MATERNO': row[3],
                    'PAIS': row[8],
                    'FUENTE_FINANCIAMIENTO': row[9],
                    'proyectos': []
                })

            fecha_inicio = row[5].strftime('%d/%m/%Y') if row[5] else ''
            fecha_fin = row[6].strftime('%d/%m/%Y') if row[6] else ''

            datosparticipante[participante_id]['proyectos'].append({
                'FECHA_INICIO': fecha_inicio,
                'FECHA_FIN': fecha_fin,
                'NOMBRE_PROYECTO': row[7],
                'AUTORIZACION': row[10]
            })

        datosparticipante = [
            {
                'ID': participante_id,
                'NOMBRE': data['NOMBRE'],
                'APELLIDO_PATERNO': data['APELLIDO_PATERNO'],
                'APELLIDO_MATERNO': data['APELLIDO_MATERNO'],
                'PAIS': data['PAIS'],
                'FUENTE_FINANCIAMIENTO': data['FUENTE_FINANCIAMIENTO'],
                'proyectos': data['proyectos']
            }
            for participante_id, data in datosparticipante.items()
        ]

        fecha_actual = datetime.now().strftime('%d/%m/%Y')
        hora_actual = datetime.now().strftime('%H:%M')

        html_string = render(request, 'reportes/reporteproyectos-pdf.html', {
                             'datosparticipante': datosparticipante, 'lista_area_tematica': lista_area_tematica, 'fecha_actual': fecha_actual, 'hora_actual': hora_actual})

        return JsonResponse({'html': html_string.content.decode('utf-8')})
    
def reporteevento(request):
    areas = Area_Tematica.objects.all().order_by('cArea_tematica')
    return render(request, 'reportes/reporteEventos.html', {
        'areas': areas
    })

def generar_reporte_evento(request):
    if request.method == 'POST':
        año = request.POST.get('Año')
        area_tematica = request.POST.get('cboAreaTematica')

        if area_tematica:
            nombrearetematica = Area_Tematica.objects.get(id=area_tematica)
            print(nombrearetematica.cArea_tematica)
            lista_area_tematica = [nombrearetematica.cArea_tematica]
        else:
            lista_area_tematica = []

        año = año if año else None
        area_tematica = area_tematica if area_tematica else None
        print(f"Año: {año}, Área Temática: {area_tematica}")

        with connection.cursor() as cursor:
            cursor.callproc('sp_report_event_area', [area_tematica, año])
            results = cursor.fetchall()

        datosparticipante = defaultdict(lambda: {'eventos': []})

        for row in results:
            participante_id = row[1]
            if participante_id not in datosparticipante:

                datosparticipante[participante_id].update({
                    'NOMBRE': row[2],
                    'APELLIDO_PATERNO': row[3],
                    'APELLIDO_MATERNO': row[4],
                    'PAIS': row[8],
                    'FUENTE_FINANCIAMIENTO': row[9],
                    'eventos': []
                })

            fecha_inicio = row[5].strftime('%d/%m/%Y') if row[5] else ''
            fecha_fin = row[6].strftime('%d/%m/%Y') if row[6] else ''

            datosparticipante[participante_id]['eventos'].append({
                'FECHA_INICIO': fecha_inicio,
                'FECHA_FIN': fecha_fin,
                'NOMBRE_EVENTO': row[7],
                'AUTORIZACION': row[10]
            })

        datosparticipante = [
            {
                'ID': participante_id,
                'NOMBRE': data['NOMBRE'],
                'APELLIDO_PATERNO': data['APELLIDO_PATERNO'],
                'APELLIDO_MATERNO': data['APELLIDO_MATERNO'],
                'PAIS': data['PAIS'],
                'FUENTE_FINANCIAMIENTO': data['FUENTE_FINANCIAMIENTO'],
                'eventos': data['eventos']
            }
            for participante_id, data in datosparticipante.items()
        ]

        fecha_actual = datetime.now().strftime('%d/%m/%Y')
        hora_actual = datetime.now().strftime('%H:%M')

        html_string = render(request, 'reportes/reporteeventos-pdf.html', {
                             'datosparticipante': datosparticipante, 'lista_area_tematica': lista_area_tematica, 'fecha_actual': fecha_actual, 'hora_actual': hora_actual})

        return JsonResponse({'html': html_string.content.decode('utf-8')})
    