from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Message(models.Model):
    text = models.CharField(max_length=3000)
    sender = models.ForeignKey(User)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    @property
    def sender_username(self):
        return self.sender.username

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = 'Message'
        ordering = ['-timestamp']


class Chat(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    participants = models.ManyToManyField(User)
    messages = models.ManyToManyField(Message)
    timestamp = models.DateTimeField(auto_now_add=True)

    @property
    def last_message_text(self):
        return self.messages.latest('timestamp').text

    @property
    def last_message_sender_id(self):
        return self.messages.latest('timestamp').sender.id

    @property
    def last_message_timestamp(self):
        return self.messages.latest('timestamp').timestamp

    @property
    def last_message_is_read(self):
        return self.messages.latest('timestamp').is_read

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = 'Chat'
        ordering = ['-timestamp']
