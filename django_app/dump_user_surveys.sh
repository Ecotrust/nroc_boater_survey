#!/bin/bash

EXPECTED_ARGS=1
E_BADARGS=65

if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Expected argument with file to save fixture as"
  exit $E_BADARGS
fi

python manage.py dumpdata --indent=2 draw_app.SurveyStatus draw_app.Route draw_app.ActivityPoint  > draw_app/fixtures/$1