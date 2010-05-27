from django.contrib.gis.db.models import *
from django.contrib.gis import admin
from django.contrib.gis.admin import OSMGeoAdmin
from django.contrib.auth.models import User
from django.conf import settings
import datetime


# class OrCoastCities(Model):
    # gid = IntegerField(primary_key = True)
    # city = CharField(max_length=25)
    # the_geom = PointField(srid=4326)        
    # objects = GeoManager()
    # class Meta:
        # db_table = u'or_coast_cities'
        
# class OrCoastPlacemarks(Model):
    # gid = IntegerField(primary_key = True)
    # name = CharField(max_length=25)
    # type = CharField(max_length=25)
    # the_geom = PointField(srid=4326)        
    # objects = GeoManager()
    # class Meta:
        # db_table = u'or_coast_placemarks'        

# class Activity(Model):
    # DrawTypeChoices = (
        # ( 'point', 'point' ),
        # ( 'polygon', 'polygon' ),
        # ( 'none', 'none' )
    # )    
    # kn_id = CharField( max_length=20 )
    # draw_type = CharField( max_length=20, choices=DrawTypeChoices, default='none' )
    # name = CharField( max_length=100 )    
    # class Meta:
        # db_table = u'activities'    

    # def __unicode__(self):v
        # return unicode('%s : %s' % (self.draw_type, self.name))

# class ActivityRecord(Model):
    # kn_user_id = TextField()
    # act = ForeignKey(Activity)    
    # creation_date = DateTimeField(default=datetime.datetime.now)

    # objects = GeoManager()    
    # class Meta:
        # abstract = True
        # managed = False
    
    # def __unicode__(self):
        # return unicode('%s : %s' % (self.kn_user_id, self.act))
    # def activity(self):
        # return unicode('%s' % self.act.name)            

class Route(Model):
    survey_id = TextField()
    user_type = CharField( max_length=1 )
    user_id = TextField()
    month = TextField()
    geometry = LineStringField(srid=settings.SERVER_SRID)
    objects = GeoManager()
    creation_date = DateTimeField(default=datetime.datetime.now)
    class Meta:
        db_table = u'route'
        
class RouteAdmin(OSMGeoAdmin):
    list_display = ('survey_id', 'user_type', 'user_id', 'month', 'creation_date')
    odering = ('survey_id',)
    
class RouteFactor(Model):
    route = ForeignKey(Route)
    survey_id = TextField()
    route_pk = IntegerField()
    factor = TextField()
    class Meta:
        db_table = u'route_factors'
        
class RouteFactorAdmin(admin.ModelAdmin):
    list_display = ('survey_id', 'route_pk', 'factor')
    odering = ('survey_id',)        
        
class ActivityArea(Model):
    survey_id = TextField()
    user_type = CharField( max_length=1 )
    user_id = TextField()
    month = TextField()
    geometry = PolygonField(srid=settings.SERVER_SRID)
    primary_activity = TextField( blank=True, null=True )
    duration = TextField( blank=True, null=True )
    rank = TextField( blank=True, null=True )
    alternate_activity_type = TextField( blank=True, null=True )
    objects = GeoManager()
    creation_date = DateTimeField(default=datetime.datetime.now)
    class Meta:
        db_table = u'act_area'
        
class ActivityAdmin(OSMGeoAdmin):
    list_display = ('survey_id', 'user_type', 'user_id', 'month', 'creation_date')
    odering = ('survey_id',)
        
class ActivityFactor(Model):
    activity = ForeignKey(ActivityArea)
    survey_id = TextField()
    activity_pk = IntegerField()
    factor = TextField()
    class Meta:
        db_table = u'activity_factors'
        
class ActivityFactorAdmin(admin.ModelAdmin):
    list_display = ('survey_id', 'activity_pk', 'factor')
    odering = ('survey_id',)                
    
class AltActArea(Model):
    survey_id = TextField()
    user_type = CharField( max_length=1 )
    user_id = TextField()
    month = TextField()
    geometry = PolygonField(srid=settings.SERVER_SRID)
    preferred_area = ForeignKey(ActivityArea)
    primary_activity = TextField( blank=True, null=True )
    objects = GeoManager()
    creation_date = DateTimeField(default=datetime.datetime.now)
    class Meta:
        db_table = u'alt_act_area'
        
class AltActAdmin(OSMGeoAdmin):
    list_display = ('survey_id', 'user_type', 'user_id', 'month', 'creation_date')
    odering = ('survey_id',)        
        
class SurveyStatus(Model):
    survey_id = TextField()
    user_type = CharField( max_length=1 )
    user_id = TextField()
    month = TextField()
    start_time = DateTimeField(default=datetime.datetime.now)
    map_status = TextField( blank=True, null=True ) #skipped?  May need to be handled before accessing draw_app
    act_status = TextField( blank=True, null=True )
    complete = BooleanField( default=False )
    complete_time = DateTimeField( blank=True, null=True )
    class Meta:
        db_table = u'survey_status'
    

# class ActivityAdmin(admin.ModelAdmin):
    # list_display = ('kn_id', 'draw_type', 'name')
    # ordering = ('id',)

# class ActivityRecordAdmin(OSMGeoAdmin):
    # list_display = ('kn_user_id','creation_date','activity')
    # ordering = ('kn_user_id',)
    # default_lon = -13900000
    # default_lat = 5520000
    # default_zoom = 6
    # mouse_position = True
    # display_srid = True    
    
admin.site.register(Route,RouteAdmin)
admin.site.register(ActivityArea,ActivityAdmin)
admin.site.register(AltActArea,AltActAdmin)
admin.site.register(RouteFactor,RouteFactorAdmin)
admin.site.register(ActivityFactor,ActivityFactorAdmin)
