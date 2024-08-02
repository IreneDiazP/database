from django.contrib import admin
from .models import UserProfile
class adminUserprofile(admin.ModelAdmin):
    readonly_fields=('created','updated')
    list_display=['apellido','nombre','user']


admin.site.register(UserProfile,adminUserprofile)

