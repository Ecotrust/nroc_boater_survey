from django.contrib.gis.db.models import *
from django.contrib.gis import admin
from django.contrib.gis.admin import OSMGeoAdmin
from django.contrib.auth.models import User
from django.conf import settings
import datetime
        
class SurveyStatus(Model):
    survey_id = CharField(primary_key = True, max_length=12)
    user_type = CharField( max_length=1 )
    user_id = CharField(max_length=6)
    month = CharField(max_length=2)
    start_time = DateTimeField(default=datetime.datetime.now)
    map_status = CharField( blank=True, null=True, max_length=30 ) #skipped?  May need to be handled before accessing draw_app
    act_status = CharField( blank=True, null=True, max_length=30 )
    complete = BooleanField( default=False )
    complete_time = DateTimeField( blank=True, null=True )
    class Meta:
        db_table = u'survey_status'
    def __unicode__(self):
        return unicode('%s' % (self.survey_id))
        
class Route(Model):
    survey_id = ForeignKey(SurveyStatus)
    geometry = LineStringField(srid=settings.SERVER_SRID)
    objects = GeoManager()
    creation_date = DateTimeField(default=datetime.datetime.now)
    class Meta:
        db_table = u'route'
        
class RouteFactor(Model):
    route = ForeignKey(Route)
    survey_id = ForeignKey(SurveyStatus)
    route_pk = IntegerField()
    factor = CharField(max_length=150)
    class Meta:
        db_table = u'route_factors'
        
class ActivityArea(Model):
    survey_id = ForeignKey(SurveyStatus)
    geometry = PolygonField(srid=settings.SERVER_SRID)
    primary_activity = CharField( blank=True, null=True, max_length=150 )
    duration = CharField( blank=True, null=True, max_length= 100 )
    rank = CharField( blank=True, null=True, max_length=100 )
    alternate_activity_type = CharField( blank=True, null=True, max_length=150 )
    alternate_activity = CharField( blank=True, null=True, max_length=150 )
    objects = GeoManager()
    creation_date = DateTimeField(default=datetime.datetime.now)
    class Meta:
        db_table = u'act_area'
        
class ActivityFactor(Model):
    activity = ForeignKey(ActivityArea)
    survey_id = ForeignKey(SurveyStatus)
    activity_pk = IntegerField()
    factor = CharField(max_length=150)
    class Meta:
        db_table = u'activity_factors'
        
class AltActArea(Model):
    survey_id = ForeignKey(SurveyStatus)
    geometry = PolygonField(srid=settings.SERVER_SRID)
    preferred_area = ForeignKey(ActivityArea)
    objects = GeoManager()
    creation_date = DateTimeField(default=datetime.datetime.now)
    class Meta:
        db_table = u'alt_act_area'
        
### ADMINS ###        

class SurveyStatusAdmin(admin.ModelAdmin):
    list_display = ('survey_id', 'map_status', 'act_status', 'complete', 'start_time', 'complete_time')
    ordering = ('start_time',)
        
class RouteAdmin(OSMGeoAdmin):
    list_display = ('pk', 'survey_id', 'creation_date')
    odering = ('survey_id',)
    default_lon = -7870000
    default_lat = 5165000
    default_zoom = 8
    mouse_position = True
    display_srid = True    
    
class RouteFactorAdmin(admin.ModelAdmin):
    list_display = ('pk', 'survey_id', 'route_pk', 'factor')
    odering = ('survey_id',)        
        
class ActivityAdmin(OSMGeoAdmin):
    list_display = ('pk', 'survey_id', 'creation_date')
    odering = ('survey_id',)
    default_lon = -7870000
    default_lat = 5165000
    default_zoom = 8
    mouse_position = True
    display_srid = True 
        
class ActivityFactorAdmin(admin.ModelAdmin):
    list_display = ('pk', 'survey_id', 'activity_pk', 'factor')
    odering = ('survey_id',)                
    
class AltActAdmin(OSMGeoAdmin):
    list_display = ('pk', 'survey_id', 'creation_date')
    odering = ('survey_id',)
    default_lon = -7870000
    default_lat = 5165000
    default_zoom = 8
    mouse_position = True
    display_srid = True
    
admin.site.register(SurveyStatus,SurveyStatusAdmin)
admin.site.register(Route,RouteAdmin)
admin.site.register(ActivityArea,ActivityAdmin)
admin.site.register(AltActArea,AltActAdmin)
admin.site.register(RouteFactor,RouteFactorAdmin)
admin.site.register(ActivityFactor,ActivityFactorAdmin)