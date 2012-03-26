#!/bin/bash

export DJANGO_SETTINGS_MODULE=settings

DB="nroc_rbs"

export PYTHONPATH=$PYTHONPATH:/usr/local/django-trunk/:/usr/local/django-apps/:.

createdb -T template_postgis $DB
python manage.py syncdb --noinput