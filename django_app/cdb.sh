#!/bin/bash

export DJANGO_SETTINGS_MODULE=settings

DB="marco_rbs"

export PYTHONPATH=$PYTHONPATH:/usr/local/src/django/:.

createdb -U marco_rbs -h localhost -W marco_rbs -T template_postgis $DB
python manage.py syncdb --noinput