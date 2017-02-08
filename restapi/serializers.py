from django.contrib.auth.models import User, Group
from rest_framework import serializers

from chat.models import Chat, Message


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class ChatSerializer(serializers.ModelSerializer):
    last_message = serializers.ReadOnlyField(source='last_message_text')
    last_message_sender_id = serializers.ReadOnlyField()
    last_message_timestamp = serializers.ReadOnlyField()
    last_message_is_read = serializers.ReadOnlyField()
    interlocutor_id = serializers.SerializerMethodField()
    interlocutor_username = serializers.SerializerMethodField()
    is_interlocutor_typing = serializers.SerializerMethodField()

    def get_interlocutor_id(self, chat):
        interlocutor = chat.participants.exclude(id=self.context['request'].user.id).first()
        return interlocutor.id

    def get_interlocutor_username(self, chat):
        interlocutor = chat.participants.exclude(id=self.context['request'].user.id).first()
        return interlocutor.username

    def get_is_interlocutor_typing(self, foo):
        return False

    class Meta:
        model = Chat
        fields = ('id', 'last_message', 'last_message_sender_id',
                  'last_message_timestamp', 'last_message_is_read', 'interlocutor_id',
                  'interlocutor_username', 'is_interlocutor_typing')


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField()

    class Meta:
        model = Message
        fields = ('text', 'sender_username', 'timestamp', 'is_read')
