#!/bin/bash
DB="or-non-con"

export PYTHONPATH=$PYTHONPATH:/usr/local/django-trunk/:/usr/local/django-apps/:.

createdb -T gis_template $DB
psql -d $DB -f ../database/or_coast_cities.sql
psql -d $DB -f ../database/or_coast_placemarks.sql
python manage.py syncdb --noinput