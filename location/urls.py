from django.urls import path
from .views import *

urlpatterns = [
    path('state_list/', state_list, name='state_list'),
    path('create_state', create_state, name='create_state'),
    path('update_state/<str:hashid>', update_state, name='update_state'),
    path('delete_state/<str:hashid>', delete_state, name='delete_state'),
    path('state_excel/', state_excel, name='state_excel'),

    path('city_list/', city_list, name='city_list'),
    path('create_city', create_city, name='create_city'),
    path('update_city/<str:hashid>', update_city, name='update_city'),
    path('delete_city/<str:hashid>', delete_city, name='delete_city'),
    path('city_excel/', city_excel, name='city_excel'),
]
