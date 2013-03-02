from fabric.api import *

vars = {
    'user': 'vagrant',
    'app_dir': '/usr/local/apps/marco_boater_survey/django_app',
    'venv': '/usr/local/venv/django_app'
}

env.forward_agent = True
#env.key_filename = '~/.vagrant.d/insecure_private_key'


def dev():
    """ Use development server settings """
    servers = ['%(user)s@127.0.0.1:2222' % vars]
    env.hosts = servers
    return servers


def prod():
    """ Use production server settings """
    servers = ['ubuntu@localhost:3022']
    env.hosts = servers
    return servers


def test():
    """ Use test server settings """
    servers = []
    env.hosts = servers
    return servers


def all():
    """ Use all servers """
    env.hosts = dev() + prod() + test()


def _install_requirements():
    run('cd %(app_dir)s && %(venv)s/bin/pip install -r ../requirements.txt' % vars)


def _install_django():
    run('cd %(app_dir)s && %(venv)s/bin/python manage.py syncdb --noinput && \
                           %(venv)s/bin/python manage.py migrate --noinput' % vars)
    collect_static()


def collect_static():
    run('cd %(app_dir)s && %(venv)s/bin/python manage.py collectstatic --noinput' % vars)


def create_superuser():
    """ Create the django superuser (interactive!) """
    run('cd %(app_dir)s && %(venv)s/bin/python manage.py createsuperuser' % vars)


def import_data():
    """ Fetches and installs data fixtures (WARNING: 5+GB of data; hence not checking fixtures into the repo) """
    run('cd %(app_dir)s && %(venv)s/bin/python manage.py import_data' % vars)


def init():
    """ Initialize the forest planner application """
    _install_requirements()
    _install_django()

def runserver():
    """ Run the django dev server on port 8000 """
    run('cd %(app_dir)s && %(venv)s/bin/python manage.py runserver 0.0.0.0:8000' % vars)


def update():
    """ Sync with master git repo """
    run('cd %(app_dir)s && git fetch && git merge origin/master' % vars)
    init()
    