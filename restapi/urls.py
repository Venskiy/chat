from django.conf.urls import url, include
from rest_framework import routers

from restapi import views


urlpatterns = [
    url(r'^get_authenticated_user$', views.get_authenticated_user, name='get_authenticated_user'),
    url(r'^get_all_users$', views.get_all_users, name='get_all_users'),
    url(r'^get_user_chats$', views.get_user_chats, name='get_user_chats'),
    url(r'^create_chat$', views.create_chat, name='create_chat'),
]
