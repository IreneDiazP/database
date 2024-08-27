from django.http import HttpResponse
from django.shortcuts import render
from django.template.loader import get_template
from weasyprint import HTML, CSS
from becarios.models import Participante
from django.db import connection
from collections import defaultdict


def reporteparticipante(request):
    # Obtener los parámetros de la solicitud (ajusta según tus necesidades)
    x_fecha = '2024'
    x_area_tem = 1

    # Ejecutar el procedimiento almacenado
    with connection.cursor() as cursor:
        cursor.callproc('sp_report_proy_area', [x_fecha, x_area_tem])
        results = cursor.fetchall()
    
    # Agrupar los datos
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
                # Formatear las fechas
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

    # Renderizar el template con el contexto
    template = get_template('reportes/participantesAño.html')
    html_string = template.render({'datosparticipante': datosparticipante})

    # Configurar la respuesta como un archivo PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="reporte_participante.pdf"'

    # Crear una hoja de estilo CSS para el PDF
    stylesheets = [
        CSS(string="""
            @page {
                size: A4;
                margin: 20mm;
            }
            body {
                font-size: 12px;
                margin: 0;
                padding: 0;
            }
            .header {
                padding: 10px;
            }
            .container-table {
                width: 100%;
                padding: 10px;
            }
            .tabla-capacitacion {
                width: 100%;
                border-collapse: collapse;
            }
            .custom-thead {
                border-bottom: 2px solid rgb(0, 0, 0); 
                border-top: 2px solid rgb(0, 0, 0); /* Borde solo en la parte inferior */
            }
            .custom-thead th {
                border-bottom: none; 
                border-top: none;
                border-left: none; 
                border-right: none; 
                padding: 10px; 
                text-align: center;
            }
            tbody th {
                padding: 10px; 
                text-align: left; 
            }
        """)
    ]

    # Convertir la cadena HTML a un archivo PDF
    html = HTML(string=html_string)
    result = html.write_pdf(stylesheets=stylesheets, presentational_hints=True)

    response.write(result)
    return response