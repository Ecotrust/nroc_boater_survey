#!/bin/bash

export DJANGO_SETTINGS_MODULE=settings

DB="nroc_rbs"

export PYTHONPATH=$PYTHONPATH:/usr/local/src/django/:.

createdb -U nroc_rbs -h localhost -W nroc_rbs -T template_postgis $DB
python manage.py syncdb --noinput