from django.conf.urls import url

from chat import views

urlpatterns = [
    url(r'^$', views.home, name='chat_homepage'),
    url(r'^get_all_users$', views.get_all_users_api, name='get_all_users'),
    url(r'^get_user_chats$', views.get_user_chats_api, name='get_user_chats'),
    url(r'^create_chat/?$', views.create_chat_api, name='create_chat'),
    url(r'^load_chat_messages/?$', views.load_chat_messages_api, name='load_chat_messages'),
    url(r'^send_message_api/?$', views.send_message_api, name='send_message_api'),
]
