from django.urls import path
from .views import *

urlpatterns = [
    path('dashboard/', dashboard, name='dashboard'),
    path('family_list', family_list, name='family_list'),
    path('update_head/<int:pk>', update_head, name='update_head'),
    path('delete_family<int:pk>', delete_family, name='delete_family'),
    path('view_family/<int:pk>', view_family, name='view_family'),
    path('add_member', add_member, name="add_member"),
    path('add_hobby/<int:pk>', add_hobby, name='add_hobby'),
    path('update_hobby/<int:pk>', update_hobby, name='update_hobby'),

    
]
