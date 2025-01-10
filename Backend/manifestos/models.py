from django.db import models

class Manifesto(models.Model):
    name = models.CharField(max_length=200)
    summary = models.CharField(max_length=3000)