from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Message(models.Model):
    text = models.CharField(max_length=3000)
    sender = models.ForeignKey(User)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.text

    class Meta:
        verbose_name = 'Message'
        ordering = ['-timestamp']


class Chat(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    participants = models.ManyToManyField(User)
    messages = models.ManyToManyField(Message, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.id

    class Meta:
        verbose_name = 'Chat'
        ordering = ['-timestamp']
