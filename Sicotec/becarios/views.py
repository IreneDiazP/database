from django.shortcuts import render
from django.http import JsonResponse
import json
from django.template.loader import render_to_string
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from .models import Departamento,Provincia,Distrito,Participante,Tipo_Documento,FormacionAcademica

from proyectos.models import Pais,Institucion_Financiamiento,Sede
# Create your views here.
@login_required
def nuevoParticipante(request):

    tipo_participante_choices = Participante.PARTICIPANTE_CHOICES
    procedencia_choices = Participante.PROCEDENCIA_CHOICES
    tipoDocumento = Tipo_Documento.objects.all().order_by('Tipo_documento')
    formacionacademica=FormacionAcademica.objects.all().order_by('nombre_formacionacademica')
    pais=Pais.objects.all().order_by('cpais')
    departamentos=Departamento.objects.all().order_by('departamento')
    institucion=Institucion_Financiamiento.objects.all().order_by('cInstFinancia')
    
    return render(request,'becarios/nuevobecario.html',{
        'tipo_participante_choices': tipo_participante_choices,
        'procedencia_choices': procedencia_choices,
        'tipoDocumento':tipoDocumento,
        'formacionacademica':formacionacademica,
        'pais':pais,
        'departamentos':departamentos,
        'institucion':institucion
    })
    


@login_required
def registrarParticpante(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            #traer datos           
            x_tipoparticipante = data.get('tipoParticipante')
            x_procedencia = data.get('procedencia')
            x_nombres = data.get('nombres')
            x_apellidoPaterno = data.get('apellidoPaterno')
            x_apellidoMaterno = data.get('apellidoMaterno')
            x_email = data.get('email')
            x_tipoDocumento = data.get('tipoDocumento')
            x_documento = data.get('documento')
            x_telefono = data.get('telefono')
            x_formacionAcademica = data.get('formacionAcademica')
            x_pais = data.get('pais')
            x_ciudad = data.get('ciudad')
            x_departamento = data.get('departamento') or None
            x_provincia = data.get('provincia') or None
            x_distrito = data.get('distrito') or None
            x_institucion = data.get('institucion')
            x_sede = data.get('sede')
            x_direccionSede = data.get('direccionSede')
            x_oficina = data.get('doficina')
            x_created_by = request.user
            
                # Instancias
            tipodocumento_instancia = Tipo_Documento.objects.get(id=x_tipoDocumento)
            formacionacademica_instancia = FormacionAcademica.objects.get(id=x_formacionAcademica)
            pais_instancia = Pais.objects.get(id=x_pais)
            
            # Manejar campos nulos o vacíos
            departamento_instancia = Departamento.objects.get(id=x_departamento) if x_departamento else None
            provincia_instancia = Provincia.objects.get(id=x_provincia) if x_provincia else None
            distrito_instancia = Distrito.objects.get(id=x_distrito) if x_distrito else None
            institucion_instancia = Institucion_Financiamiento.objects.get(id=x_institucion)
            
            
            regisrarsede, created = Sede.objects.get_or_create(
                nombre_sede=x_sede, 
                direccion_sede=x_direccionSede,
                oficina_sede=x_oficina,
                institucion_financiamiento=institucion_instancia
            )
            
            participantenuevo=Participante(
                tipo_participante = x_tipoparticipante,
                procedencia = x_procedencia,
                nom_participante = x_nombres,
                apellPate_participante = x_apellidoPaterno,
                apellMate_participante = x_apellidoMaterno,
                email = x_email,
                cTipo_Documento = tipodocumento_instancia,
                numero_documento = x_documento,
                telefono = x_telefono,
                cFormacion_academica = formacionacademica_instancia,
                cpais = pais_instancia,
                cdepartamento = departamento_instancia,
                cprovincia = provincia_instancia,
                cdistrito = distrito_instancia,
                ciudad = x_ciudad,
                sede=regisrarsede,
                created_by=x_created_by
            )
            
            participantenuevo.save()
            
            return JsonResponse({'success': True, 'message': 'Participante registrado correctamente'})
        except ObjectDoesNotExist as e :   
            return JsonResponse({'success': False, 'message': f'Error al registrar el Participante: {str(e)}'}, status=500)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error inesperado: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

def actualizarParticipante(request):
    if request.method == 'POST':
        import json
        
        try:

            data = json.loads(request.body)
            print('Los datos son:', data)

            for item in data.get('changes', []):
                participante_id = item.get('id')
                tipo_procedencia = item.get('procedencia')
                estado = item.get('estado')
                

                try:
                    participante = Participante.objects.get(id=participante_id)
                    
                    if tipo_procedencia:
                        participante.procedencia = tipo_procedencia  
                    if estado is not None:
                        participante.estado = estado
                    participante.save()
                except Participante.DoesNotExist:
                    continue
            
            # datos actualizados para la tabla
            participantes = Participante.objects.all().values(
                'id', 'nom_participante', 'apellPate_participante', 'apellMate_participante',
                'tipo_participante', 'procedencia', 'estado', 'sede__institucion_financiamiento__cInstFinancia'
            )

            return JsonResponse({'status': 'success', 'participantes': list(participantes)})

        except json.JSONDecodeError:
            
            return JsonResponse({'status': 'error', 'message': 'Datos JSON inválidos'}, status=400)

    return JsonResponse({'status': 'error'}, status=400)
    

@login_required
def editarparticipante(request):
    print('hola de editar participante')
    return render(request,'becarios/editarparticipante.html')



@login_required
def todosparticipantes (request):
    participantes=Participante.objects.all().select_related('sede__institucion_financiamiento')

    return render(request,'becarios/todosparticipantes.html',{
        'participantes':participantes
    })



@login_required
def getProvincias (request, iddepartamento):
    provincia=Provincia.objects.filter(departamento_id=iddepartamento).order_by('provincia')
    data= list(provincia.values('id','provincia'))
    return JsonResponse(data, safe=False)




@login_required
def getDistrito (request, idprovincia):
    distrito = Distrito.objects.filter(provincia_id=idprovincia).order_by('distrito')
    data= list(distrito.values('id','distrito'))
    return JsonResponse(data, safe=False)
