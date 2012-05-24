# Django settings for gwst project.
DEBUG=True

ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)

MANAGERS = ADMINS

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Los_Angeles'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = 'set-in-local_settings'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = '/media/'

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/admin-media/'

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'set-in-local_settings'

GMAPS_API_KEY = ''

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    # 'django.template.loaders.filesystem.load_template_source',
    # 'django.template.loaders.app_directories.load_template_source',
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
)

ROOT_URLCONF = 'urls'

import os, sys
TEMPLATE_DIRS = (
    '/usr/local/django-trunk/django/contrib/gis/templates/',
    os.path.join(os.path.dirname(__file__), 'templates').replace('\\','/'),
    os.path.abspath(os.path.dirname(sys.argv[0])) +'/admin_utils/templates/',
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',    
    'django.contrib.sites',
    'django.contrib.admin',
    'django.contrib.humanize',
    'django.contrib.gis',
    'django.contrib.staticfiles',
    'draw_app',
    'admin_utils',
    'videos',
    'compress',
    'faq'
)

LOGIN_REDIRECT_URL = '/admin/utils/dashboard/'

SELF_REGISTRATION=False
SELF_SURVEY_RESET=False

CLIENT_SRID = 4326    #Google projection
SERVER_SRID = 4326   #Google projection

ENVIRONMENT_TYPE = 'Dev'

COMPRESS_CSS = {}

COMPRESS_JS = {
    'survey_compressed': {
        'source_filenames':(
            'third-party/GeoExt-1.0/GeoExt/lib/GeoExt/widgets/MapPanel.js',	
            'third-party/GeoExt-1.0/GeoExt/lib/GeoExt/data/LayerRecord.js',
            'third-party/GeoExt-1.0/GeoExt/lib/GeoExt/data/LayerReader.js',
            'third-party/GeoExt-1.0/GeoExt/lib/GeoExt/data/LayerStore.js',
            'third-party/GeoExt-1.0/GeoExt/lib/GeoExt/data/ProtocolProxy.js',	
            'third-party/GeoExt-1.0/GeoExt/lib/GeoExt/data/FeatureRecord.js',
            'third-party/GeoExt-1.0/GeoExt/lib/GeoExt/data/FeatureReader.js',
            'third-party/GeoExt-1.0/GeoExt/lib/GeoExt/data/FeatureStore.js',		
            'third-party/GeoExt-1.0/GeoExt/lib/GeoExt/widgets/grid/FeatureSelectionModel.js',
            'js/settings.js', 
            'js/DrawApp.js', 
            'js/DrawManager.js',
            'js/Handler/ResumablePath.js',
            'js/controls/BorderPan.js',
            'js/Layer/GeoWebCache.js',
            'js/widgets/MainViewport.js', 
            'js/widgets/DrawMapPanel.js', 
            'js/widgets/WestPanel.js', 
            'js/widgets/01MapIntroductionPanel.js', 
            'js/widgets/02PlotRoutePanel.js', 
            'js/widgets/02aFinishRoutePanel.js', 
            'js/widgets/04ActivityAreasPanel.js', 
            'js/widgets/04aActivityPlottedPanel.js', 
            'js/widgets/05ActivityQuestionsPanel.js', 
            'js/widgets/05aFishingQuestionsPanel.js', 
            'js/widgets/05bViewingQuestionsPanel.js', 
            'js/widgets/05cDivingQuestionsPanel.js', 
            'js/widgets/06MoreActivitiesPanel.js', 
            'js/widgets/AddPolyWindow.js', 
            'js/widgets/CancelWindow.js', 
            'js/widgets/CustomButtons.js', 
            'js/widgets/EditRoutePanel.js', 
            'js/widgets/ErrorWindow.js', 
            'js/widgets/FinishPanel.js', 
            'js/widgets/InvalidRoutePanel.js', 
            'js/widgets/InvalidShapePanel.js', 
            'js/widgets/NavDetailsWindow.js', 
            'js/widgets/NavHelpWindow.js', 
            'js/widgets/RoundTripWindow.js', 
            'js/widgets/ResetMapCheckWindow.js', 
            'js/widgets/ResetMapWindow.js', 
            'js/widgets/SatisfiedShapePanel.js', 
            'js/widgets/TwoButtonPanel.js', 
            'js/widgets/UndoWindow.js', 
            'js/widgets/WaitWindow.js', 
            'js/widgets/YesNoButtons.js'
            ), 
        'output_filename': 'compressed/survey_compressed.js'
    }
}

try:
    from local_settings import *
except ImportError, exp:
    pass
