from django.contrib.gis.db.models import *
from django.contrib.gis import admin
from django.contrib.gis.admin import OSMGeoAdmin
from django.contrib.auth.models import User
from django.conf import settings
import datetime

class OrCoastCities(Model):
    gid = IntegerField(primary_key = True)
    city = CharField(max_length=25)
    the_geom = PointField(srid=4326)        
    objects = GeoManager()
    class Meta:
        db_table = u'or_coast_cities'
        
class OrCoastPlacemarks(Model):
    gid = IntegerField(primary_key = True)
    name = CharField(max_length=25)
    type = CharField(max_length=25)
    the_geom = PointField(srid=4326)        
    objects = GeoManager()
    class Meta:
        db_table = u'or_coast_placemarks'        

class Activity(Model):
    DrawTypeChoices = (
        ( 'point', 'point' ),
        ( 'polygon', 'polygon' ),
        ( 'none', 'none' )
    )    
    kn_id = CharField( max_length=20 )
    draw_type = CharField( max_length=20, choices=DrawTypeChoices, default='none' )
    name = CharField( max_length=100 )    
    class Meta:
        db_table = u'activities'    

    def __unicode__(self):
        return unicode('%s : %s' % (self.draw_type, self.name))

class ActivityRecord(Model):
    kn_user_id = TextField()
    act = ForeignKey(Activity)    
    creation_date = DateTimeField(default=datetime.datetime.now)

    objects = GeoManager()    
    class Meta:
        abstract = True
        managed = False
    
    def __unicode__(self):
        return unicode('%s : %s' % (self.kn_user_id, self.act))
    def activity(self):
        return unicode('%s' % self.act.name)            

class ActivityPoint(ActivityRecord):
    geometry = PointField(srid=settings.SERVER_SRID)
    objects = GeoManager()    
    class Meta:
        db_table = u'act_point'
    
class ActivityPoly(ActivityRecord):
    geometry = PolygonField(srid=settings.SERVER_SRID)
    objects = GeoManager()    
    class Meta:
        db_table = u'act_poly'

class ActivityAdmin(admin.ModelAdmin):
    list_display = ('kn_id', 'draw_type', 'name')
    ordering = ('id',)

class ActivityRecordAdmin(OSMGeoAdmin):
    list_display = ('kn_user_id','creation_date','activity')
    ordering = ('kn_user_id',)
    default_lon = -13900000
    default_lat = 5520000
    default_zoom = 6
    mouse_position = True
    display_srid = True    

admin.site.register(Activity,ActivityAdmin)
admin.site.register(ActivityPoint,ActivityRecordAdmin)
admin.site.register(ActivityPoly,ActivityRecordAdmin)
