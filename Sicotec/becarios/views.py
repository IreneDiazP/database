from django.shortcuts import render

# Create your views here.
def nuevobecario(request):
    print('hola')
    return render(request,'becarios/nuevobecario.html')