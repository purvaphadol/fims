from django.urls import path
from .views import *

urlpatterns = [
    path('dashboard/', dashboard, name='dashboard'),
    path('family_list', family_list, name='family_list'),
    path('update_family/<int:pk>', update_family, name='update_family'),
    path('delete_family<int:pk>', delete_family, name='delete_family'),
    path('view_family/<int:pk>', view_family, name='view_family'),

]
