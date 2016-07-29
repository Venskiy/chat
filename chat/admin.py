from django.contrib import admin

from chat.models import Message, Chat

class MessageAdmin(admin.ModelAdmin):
    list_display = ['__unicode__']

admin.site.register(Message, MessageAdmin)

class ChatAdmin(admin.ModelAdmin):
    list_display = ['__unicode__']

admin.site.register(Chat, ChatAdmin)
