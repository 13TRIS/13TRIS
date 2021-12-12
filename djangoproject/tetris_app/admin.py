from django.contrib import admin
# Register your models here.

from . import models

admin.site.register(models.Profile)
admin.site.register(models.Match)
admin.site.register(models.History)
admin.site.register(models.MatchManagement)
admin.site.register(models.Friend)

