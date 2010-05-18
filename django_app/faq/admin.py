from django.contrib import admin
from models import *

class FaqInline(admin.TabularInline):
    model = Faq
    
class FaqGroupAdmin(admin.ModelAdmin):
    list_display = ('__unicode__','faq_group_name')
    inlines = [
        FaqInline,
    ]
admin.site.register(FaqGroup, FaqGroupAdmin)