#!/bin/bash
python manage.py dumpdata --indent=2 sites videos draw_app.Activity > draw_app/fixtures/initial_data.json
