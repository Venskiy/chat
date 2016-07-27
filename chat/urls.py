from django.conf.urls import url

from chat import views

urlpatterns = [
    url(r'^$', views.home, name='chat_homepage'),
    url(r'^send_message_api/?$', views.send_message_api, name='send_message_api'),
]
