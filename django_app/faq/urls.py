from django.conf.urls.defaults import *
from django.conf import settings
from faq.views import *

urlpatterns = patterns('',
    url(r'^$', faq, name='faq')
) 