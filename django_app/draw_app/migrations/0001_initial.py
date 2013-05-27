# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'SurveyStatus'
        db.create_table(u'survey_status', (
            ('survey_id', self.gf('django.db.models.fields.CharField')(max_length=12, primary_key=True)),
            ('user_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('user_id', self.gf('django.db.models.fields.CharField')(max_length=8)),
            ('month_id', self.gf('django.db.models.fields.CharField')(max_length=2)),
            ('start_time', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            ('map_status', self.gf('django.db.models.fields.CharField')(max_length=30, null=True, blank=True)),
            ('act_status', self.gf('django.db.models.fields.CharField')(max_length=30, null=True, blank=True)),
            ('complete', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('complete_time', self.gf('django.db.models.fields.DateTimeField')(null=True, blank=True)),
        ))
        db.send_create_signal('draw_app', ['SurveyStatus'])

        # Adding model 'Route'
        db.create_table(u'route', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('survey', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['draw_app.SurveyStatus'])),
            ('geometry', self.gf('django.contrib.gis.db.models.fields.LineStringField')()),
            ('zoom_level', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
        ))
        db.send_create_signal('draw_app', ['Route'])

        # Adding model 'ActivityPoint'
        db.create_table(u'act_point', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('survey', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['draw_app.SurveyStatus'])),
            ('geometry', self.gf('django.contrib.gis.db.models.fields.PointField')()),
            ('fishing', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('viewing', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('scenic_viewing', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('diving', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('swimming', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('relaxing', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('other_act', self.gf('django.db.models.fields.CharField')(max_length=150, null=True, blank=True)),
            ('f_billfish', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_blackseabass', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_bluefish', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_cobia', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_croaker', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_drum', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_grouper', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_summer_flounder', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_scup', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_shark', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_spot', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_spotted_sea_trout', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_strbass', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_tautog', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_tilefish', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_tuna', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_weakfish', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_mahi_mahi', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_wahoo', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('f_other', self.gf('django.db.models.fields.CharField')(max_length=150, null=True, blank=True)),
            ('v_whales', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('v_dol_porp', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('v_turtles', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('v_birds', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('v_seals', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('v_other', self.gf('django.db.models.fields.CharField')(max_length=150, null=True, blank=True)),
            ('d_explore', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('d_wrecks', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('d_fishing', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('d_other', self.gf('django.db.models.fields.CharField')(max_length=150, null=True, blank=True)),
            ('zoom_level', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
        ))
        db.send_create_signal('draw_app', ['ActivityPoint'])


    def backwards(self, orm):
        # Deleting model 'SurveyStatus'
        db.delete_table(u'survey_status')

        # Deleting model 'Route'
        db.delete_table(u'route')

        # Deleting model 'ActivityPoint'
        db.delete_table(u'act_point')


    models = {
        'draw_app.activitypoint': {
            'Meta': {'object_name': 'ActivityPoint', 'db_table': "u'act_point'"},
            'created': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'd_explore': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'd_fishing': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'd_other': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'd_wrecks': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'diving': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_billfish': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_blackseabass': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_bluefish': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_cobia': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_croaker': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_drum': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_grouper': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_mahi_mahi': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_other': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'f_scup': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_shark': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_spot': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_spotted_sea_trout': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_strbass': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_summer_flounder': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_tautog': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_tilefish': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_tuna': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_wahoo': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'f_weakfish': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'fishing': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'geometry': ('django.contrib.gis.db.models.fields.PointField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'other_act': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'relaxing': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'scenic_viewing': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'survey': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['draw_app.SurveyStatus']"}),
            'swimming': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'v_birds': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'v_dol_porp': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'v_other': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'v_seals': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'v_turtles': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'v_whales': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'viewing': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'zoom_level': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'})
        },
        'draw_app.route': {
            'Meta': {'object_name': 'Route', 'db_table': "u'route'"},
            'created': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'geometry': ('django.contrib.gis.db.models.fields.LineStringField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'survey': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['draw_app.SurveyStatus']"}),
            'zoom_level': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'})
        },
        'draw_app.surveystatus': {
            'Meta': {'object_name': 'SurveyStatus', 'db_table': "u'survey_status'"},
            'act_status': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True', 'blank': 'True'}),
            'complete': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'complete_time': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'map_status': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True', 'blank': 'True'}),
            'month_id': ('django.db.models.fields.CharField', [], {'max_length': '2'}),
            'start_time': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'survey_id': ('django.db.models.fields.CharField', [], {'max_length': '12', 'primary_key': 'True'}),
            'user_id': ('django.db.models.fields.CharField', [], {'max_length': '8'}),
            'user_type': ('django.db.models.fields.CharField', [], {'max_length': '1'})
        }
    }

    complete_apps = ['draw_app']