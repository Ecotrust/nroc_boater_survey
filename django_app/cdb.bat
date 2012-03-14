createdb -U postgres -T template_postgis nroc_rbs
python manage.py syncdb --noinput