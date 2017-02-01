from django.conf.urls import url

from restapi import views

urlpatterns = [
    url(r'^get_info_about_authenticated_user$',
        views.get_info_about_authenticated_user,
        name='get_info_about_authenticated_user'),
]
