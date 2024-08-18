from django.http import HttpResponse
from django.template.loader import get_template
from weasyprint import HTML, CSS

def reporteparticipante(request):
    # Datos que se pasarán al template
    garien = 'panda'
    
    # Renderizar el template con el contexto
    template = get_template('reportes/participantesAño.html')
    html_string = template.render({'garien': garien})
    
    # Configurar la respuesta como un archivo PDF
    response = HttpResponse(content_type='application/pdf')
    filename = f"{garien}.pdf"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    # Crear una hoja de estilo CSS para ocupar toda la página
    stylesheets = [
        CSS(string="""
            @page {
                size: A4;
                margin: 0;
            }
            body {
                margin: 0;
                padding: 0;
                font-size: 12px;
            }
            .header {
                padding: 10px;
            }
            .content {
                padding: 10px;
            }
        """)
    ]
    
    # Convertir la cadena HTML a un archivo PDF
    html = HTML(string=html_string)
    result = html.write_pdf(stylesheets=stylesheets, presentational_hints=True)
    
    response.write(result)
    return response

    #return render(request,'reportes/participantesAño.html')