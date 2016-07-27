from django.contrib import admin

from chat.models import Message

class MessageAdmin(admin.ModelAdmin):
    list_display = ['__unicode__']

admin.site.register(Message, MessageAdmin)
