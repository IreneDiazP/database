from django.urls import path
from . import views
urlpatterns = [
    path('reporteparticipante/',views.reporteparticipante, name='reporteparticipante')
]
