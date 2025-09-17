from django.urls import path
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path("family_form/", family_form, name="family_form"),
    path('get_cities/<int:state_id>', get_cities, name='get_cities'),
    path('family_pdf/<int:pk>', family_pdf, name='family_pdf'),
    path('family_excel/<int:pk>', family_excel, name='family_excel'),
    path('head_excel/', head_excel, name='head_excel'),
]
