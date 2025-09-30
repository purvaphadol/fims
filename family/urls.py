from django.urls import path
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path("family_form/", family_form, name="family_form"),
    path('get_cities/<int:pk>', get_cities, name='get_cities'),
    path('family_pdf/<str:hashid>', family_pdf, name='family_pdf'),
    path('family_excel/<str:hashid>', family_excel, name='family_excel'),
    path('head_excel/', head_excel, name='head_excel'),
]
