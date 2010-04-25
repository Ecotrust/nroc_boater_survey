#!/bin/bash
DB="rbsw"

export PYTHONPATH=$PYTHONPATH:/usr/local/django-trunk/:/usr/local/django-apps/:.

createdb -T gis_template $DB
python manage.py syncdb --noinput