# local settings
DEBUG=True
TEMPLATE_DEBUG=DEBUG

ADMINS = (
    ('Your Name', 'your@email.com'),
)
SERVER_EMAIL=''
SEND_BROKEN_LINK_EMAILS=True

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': '',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        # 'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        # 'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

BASE_PATH = '' # like: 'C:/dev/survey/django_app'

MEDIA_ROOT = '' # like: 'C:/dev/survey/media' - where the Django development server goes to look for your static files
MEDIA_URL = '/media/' # the URL dir through which your web server serves static pages and images

SITE_ID = 1

FIXTURE_DIRS = [BASE_PATH+'fixtures']

GMAPS_API_KEY = ''

CLIENT_SRID = 900913    #google
SERVER_SRID = 4326    #lat/lon

VIDEO_PLAYER = MEDIA_URL+'third-party/jw-flv-player/player.swf'
VIDEO_PATH = 'videos'
VIDEO_IMAGES = '\videos\images'
VIDEO_URL = '' # like: 'http://########.###.cloudfiles.rackspacecloud.com/media/videos/'
VIDEO_FILE = 'mass_help'
