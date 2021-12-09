from django.contrib import admin
# Register your models here.

from .models import *

admin.site.register(User)
admin.site.register(Match)
admin.site.register(History)
admin.site.register(MatchManagement)
