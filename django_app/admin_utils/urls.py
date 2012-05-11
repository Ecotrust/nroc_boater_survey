from django.conf.urls.defaults import *
from views import *
import os

urlpatterns = patterns('',
    (r'^dashboard', dashboard ),
    # (r'^', login ),
    # (r'^login/$', login, {'template_name': 'admin\login.html'}),
    # (r'^$', login),
    (r'^port_surveys', port_surveys ),
    (r'^export_surveys', export_surveys ),
    (r'^export_shapefile', export_shapefile ),
    (r'^export_csv', export_csv ),
    (r'^import_surveys', import_surveys ),
)