from django.conf.urls import url

from chat import views

urlpatterns = [
    url(r'^$', views.home, name='chat_homepage'),
    url(r'^get_all_users$', views.get_all_users_api, name='get_all_users'),
    url(r'^create_chat/?$', views.create_chat_api, name='create_chat'),
    url(r'^send_message_api/?$', views.send_message_api, name='send_message_api'),
]
