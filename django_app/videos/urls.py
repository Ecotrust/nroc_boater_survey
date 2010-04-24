from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',   
    (r'^$', listVideos),  
    url(r'^(\w+)/$', showVideo, name='showVideo'),
    url(r'^(?P<pk>\d)/$', showVideoById, name='showVideoById'),
)
