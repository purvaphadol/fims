from django.urls import path
from .views import *

urlpatterns = [
    path('state_list', state_list, name='state_list'),
    path('create_state', create_state, name='create_state'),
    path('update_state/<int:pk>', update_state, name='update_state'),
    path('delete_state<int:pk>', delete_state, name='delete_state'),
    # path('view_family/<int:pk>', view_family, name='view_family'),
]