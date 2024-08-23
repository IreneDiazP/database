from django.urls import path
from .import views

urlpatterns = [
    path('',views.login_view, name='login'),
    path('home/', views.home, name = "home"),
    path('salir/', views.salir, name = "salir"),
    path('cambiopassword/',views.cambiopassword, name= "cambiopassword")
]
