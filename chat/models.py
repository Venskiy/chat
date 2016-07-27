from django.db import models

# Create your models here.

class Message(models.Model):
    text = models.CharField(max_length=3000)

    def __unicode__(self):
        return self.text

    class Meta:
        verbose_name = 'Message'
