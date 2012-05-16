from django.conf.urls.defaults import *
from views import *
import os

urlpatterns = patterns('',
    (r'^dashboard/([A-Za-z0-9_-]+)$', dashboard ),
    (r'^dashboard/', dashboard ),
    # (r'^', login ),
    # (r'^login/$', login, {'template_name': 'admin\login.html'}),
    # (r'^$', login),
    (r'^port_surveys', port_surveys ),
    (r'^export_surveys', export_surveys ),
    (r'^export_points_shapefile/([A-Za-z0-9_-]+)$', export_points_shapefile ),
    (r'^export_points_shapefile/', export_points_shapefile ),
    (r'^export_routes_shapefile/([A-Za-z0-9_-]+)$', export_routes_shapefile ),
    (r'^export_routes_shapefile/', export_routes_shapefile ),
    (r'^export_csv/([A-Za-z0-9_-]+)$', export_csv ),
    (r'^export_csv/', export_csv ),
    (r'^import_surveys', import_surveys ),
)