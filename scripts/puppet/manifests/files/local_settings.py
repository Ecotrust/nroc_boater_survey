import os, sys
SECRET_KEY = '<%= secretkey %>'

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': '<%= dbname%>',
        'USER': '<%= dbuser%>',
    }
}

# This should be a local folder created for use with the install_media command 
# MEDIA_ROOT = '/usr/local/apps/<%= reponame%>/mediaroot/'
MEDIA_ROOT = '/usr/local/apps/<%= reponame%>/media/'
MEDIA_URL = 'http://localhost:8000/media/'
STATIC_URL = 'http://localhost:8000/install-media/'

BASE_PATH = '/usr/local/apps/<%= reponame%>/<%= projectname%>'

POSTGIS_TEMPLATE='template1'
DEBUG = True
TEMPLATE_DEBUG = DEBUG 

ADMINS = (
        ('Madrona', 'madrona@ecotrust.org')
        ) 

import logging
logging.getLogger('django.db.backends').setLevel(logging.ERROR)
LOG_FILE = os.path.join(os.path.dirname(__file__),'..','<%= appname%>.log')



ENVIRONMENT_TYPE = 'Dev'

ADMIN_MEDIA_PREFIX = '/admin-media/'

# STATIC_URL = '/install-media/'

ADMIN_MEDIA_ROOT = os.path.abspath(os.path.dirname(sys.argv[0])) + ADMIN_MEDIA_PREFIX # like: /admin-media - where the Django development server goes to look for your static admin files

STATICFILES_ROOT = os.path.abspath(os.path.dirname(sys.argv[0])) + STATIC_URL
STATIC_ROOT = os.path.abspath(os.path.dirname(sys.argv[0])) + STATIC_URL

# STATICFILES_DIRS = (
    # os.path.abspath('/usr/local/venv/django_app/lib/python2.7/site-packages/django_extjs/static'),
# )

SITE_ID = 1

FIXTURE_DIRS = [BASE_PATH+'fixtures']

GMAPS_API_KEY = '<%= mapkey%>'

CLIENT_SRID = 900913    #lat/lon
SERVER_SRID = 4326    #lat/lon

# CACHE_BACKEND = 'file:///tmp/django_cache/?timeout=604800&max_entries=300'

VIDEO_PLAYER = MEDIA_URL+'third-party/jw-flv-player/player.swf'
VIDEO_PATH = 'videos'
VIDEO_IMAGES = '\videos\images'
VIDEO_URL = 'http://c3442723.r23.cf0.rackcdn.com/'
VIDEO_FILE = 'NROC_Help_raw'