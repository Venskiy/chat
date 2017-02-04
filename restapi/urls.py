from django.conf.urls import url, include
from rest_framework import routers

from restapi import views


urlpatterns = [
    url(r'^get_authenticated_user$', views.get_authenticated_user, name='get_authenticated_user'),
    url(r'^get_all_users$', views.get_all_users, name='get_all_users'),
]
