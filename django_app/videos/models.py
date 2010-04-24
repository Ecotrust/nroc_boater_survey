from django.contrib.gis.db import models
from django.conf import settings

class Video(models.Model):
    video = models.FileField(upload_to=settings.VIDEO_PATH)
    #image = models.ImageField(upload_to=settings.VIDEO_IMAGES, null=True)    
    title = models.CharField(max_length=100)
    urlname = models.CharField(max_length=100)
    description = models.CharField(max_length=350)
    height = models.IntegerField()
    width = models.IntegerField()
    selected_for_help = models.BooleanField(default=False, help_text="Display this screencast on the main help page?")
    IMPORTANCE_CHOICES = (
        (1,'1'),
        (2,'2'),
        (3,'3'),
        (4,'4'),
        (5,'5'),
        (6,'6'),
        (7,'7'),
        (8,'8'),
        (9,'9'),
        (10,'10')                      
    )
    importance = models.IntegerField(choices=IMPORTANCE_CHOICES, blank=True, null=True)
    
    class Meta:
        db_table = 'videos'
        
    def __unicode__(self):
        return self.title