from django.contrib.gis.db import models

class FaqGroup(models.Model):
    class Meta:
        db_table = u'gwst_faqgroup'

    def __unicode__(self):
        return u"%s" % (self.faq_group_name)
    
    faq_group_name = models.CharField(max_length=50)

class Faq(models.Model):
    class Meta:
        db_table = u'gwst_faq'

    def __unicode__(self):
        return u"%s" % (self.id)

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
                                    
    question = models.TextField(help_text='Question', max_length=200)
    answer = models.TextField(help_text='Answer', max_length=2000)
    importance = models.IntegerField(help_text='Importance 1-1-', choices=IMPORTANCE_CHOICES)
    faq_group = models.ForeignKey(FaqGroup)    