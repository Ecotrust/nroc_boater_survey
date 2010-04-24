from django.conf.urls.defaults import *
from django.contrib.auth.views import *
from django.views.decorators.cache import cache_page

from views import *

urlpatterns = patterns('',                      
	(r'^$', draw ),
    (r'^draw_settings/(\d+)/json/$', draw_settings),
    (r'^or_coast_cities/json/$', cache_page(or_coast_cities, 60*15)),
    (r'^or_coast_placemarks/json/$', cache_page(or_coast_placemarks, 60*15)),
    (r'^shape/validate/$', validate_shape),
    (r'^shapes/(\d*)$', shapes),
    (r'^report/$', report),
)
