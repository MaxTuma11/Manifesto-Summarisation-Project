from django.db import models

class Manifesto(models.Model):
    name = models.CharField(max_length=200, default="Null")
    summary = models.CharField(max_length=3000, default="Null")
    environment = models.CharField(max_length=3000, default="Null")
    education = models.CharField(max_length=3000, default="Null")
    immigration = models.CharField(max_length=3000, default="Null")
    housing = models.CharField(max_length=3000, default="Null")
    health = models.CharField(max_length=3000, default="Null")
    transport = models.CharField(max_length=3000, default="Null")
    economy = models.CharField(max_length=3000, default="Null")
    crime = models.CharField(max_length=3000, default="Null")


#https://yougov.co.uk/topics/society/trackers/the-most-important-issues-facing-the-country
#this link provides up to date information on current important issues facing the UK from YouGov polls