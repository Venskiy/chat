from django.contrib.auth.models import User, Group
from rest_framework import serializers

from chat.models import Chat


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class ChatSerializer(serializers.ModelSerializer):
    last_message = serializers.CharField(required=True, allow_blank=False, max_length=3000)
    last_message_sender_id = serializers.IntegerField(required=True)
    last_message_timestamp = serializers.DateTimeField()
    last_message_is_read = serializers.BooleanField(required=True)
    interlocutor_id = serializers.IntegerField(required=True)
    interlocutor_username = serializers.CharField(required=True, allow_blank=False, max_length=256)
    is_interlocutor_typing = serializers.BooleanField(required=True)

    def __init__(self, last_message, interlocutor, **kwargs):
        super(ChatSerializer, self).__init__(**kwargs)
        self.last_message = last_message.text
        self.last_message_sender_id = last_message.sender.id
        self.last_message_timestamp = last_message.timestamp
        self.last_message_is_read = last_message.is_read
        self.interlocutor_id = interlocutor.id
        self.interlocutor_username = interlocutor.username
        self.is_interlocutor_typing = False

    class Meta:
        model = Chat
        fields = ('id',)
