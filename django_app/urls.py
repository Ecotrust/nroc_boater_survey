from django.conf.urls.defaults import *
from django.conf import settings


# Uncomment the next two lines to enable the admin:
from django.contrib.gis import admin
admin.autodiscover()
from django.contrib import databrowse

from views import *

urlpatterns = patterns('',
    (r'^$', intro),
    (r'^draw/', include('draw_app.urls')),
    url(r'^faq/', include('faq.urls'), name='faq'),
    (r'^videos/', include('videos.urls')),
    (r'^admin/', include(admin.site.urls)),
    (r'^test/', test),
    (r'^complete/', complete),
)

#Serve media through development server instead of web server (Apache)
if settings.DEBUG is True:
    urlpatterns += patterns('',
        (r'^media/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        (r'^admin-media/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.ADMIN_MEDIA_ROOT, 'show_indexes': True}),
        (r'^admin/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.ADMIN_MEDIA_PREFIX, 'show_indexes': True})
    )
    
