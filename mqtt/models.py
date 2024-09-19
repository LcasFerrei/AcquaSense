from django.db import models

class MessageTest(models.Model):
    content = models.TextField()
    received_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content
