from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core.servers.basehttp import FileWrapper
from django.core.files import File
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, REDIRECT_FIELD_NAME, login
from django.contrib.auth.views import auth_login, logout
from draw_app.models import *
from forms import *
from django.core import serializers
from shapes.views import ShpResponder
from django.template.defaultfilters import slugify
import datetime
import os
import csv
import zipfile
from StringIO import StringIO
import tempfile

@login_required
def dashboard(request, time_period='all', template='dashboard.html'):
    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'GET':
        return HttpResponse('Action not permitted', status=403)
    export_form = ExportSurveysForm()
    import_form = ImportSurveysForm()
    if time_period and time_period != 'all':
        survey_data = SurveyStatus.objects.filter(month_id = time_period)
        routes = Route.objects.filter(survey__month_id = time_period)
        points = ActivityPoint.objects.filter(survey__month_id = time_period)
    else:
        survey_data = SurveyStatus.objects.all()
        routes = Route.objects.all()
        points = ActivityPoint.objects.all()
    month = []
    survey_count = survey_data.count()
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    month_ids = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
    for record in SurveyStatus.objects.all().order_by('month_id'):
        if not record.month_id == '' and month_ids.__contains__(record.month_id) and not int(record.month_id) > 11 and not month.__contains__({'id': record.month_id, 'name':months[int(record.month_id)], 'selected': ''}) and not month.__contains__({'id': record.month_id, 'name':months[int(record.month_id)], 'selected': 'selected="selected"'}):
            if record.month_id == time_period:
                month.append({'id': record.month_id, 'name':months[int(record.month_id)], 'selected': 'selected="selected"'})
            else:
                month.append({'id': record.month_id, 'name':months[int(record.month_id)], 'selected': ''})
    if survey_count > 0:
        completes = survey_data.filter(complete = True)
        complete_count = completes.count()
        complete_pct = str(round((float(complete_count) / survey_count) * 100, 2)) + '%'
        skipped_count = survey_data.filter(complete = True, map_status = "Skipped").count()
        skipped_pct = str(round((float(skipped_count) / survey_count) * 100, 2)) + '%'
        mapped_count = complete_count - skipped_count
        mapped_pct = str(round((float(mapped_count) / survey_count) * 100, 2)) + '%'
        incompletes = survey_data.filter(complete = False)
        incomplete_count = incompletes.count()
        incomplete_pct = str(round((float(incomplete_count) / survey_count) * 100, 2)) + '%'

        routes_in_cache = 0
        route_cache_zoom_total = 0
        routes_in_NOAA = 0
        route_NOAA_zoom_total = 0
        route_cache_zoom_avg = 0
        route_NOAA_zoom_avg = 0
        for route in routes:
            if route.zoom_level < 9:
                routes_in_cache = routes_in_cache + 1
                route_cache_zoom_total = route_cache_zoom_total + route.zoom_level
            else:
                routes_in_NOAA = routes_in_NOAA + 1
                route_NOAA_zoom_total = route_NOAA_zoom_total + route.zoom_level
        if routes_in_cache > 0:
            route_cache_zoom_avg = float(route_cache_zoom_total)/routes_in_cache
        if routes_in_NOAA > 0:
            route_NOAA_zoom_avg = float(route_NOAA_zoom_total)/routes_in_NOAA
        route_count = routes_in_cache + routes_in_NOAA
        if route_count > 0:
            route_cache_pct = str(round(float(routes_in_cache)/route_count * 100, 2)) + '%'
            route_NOAA_pct = str(round(float(routes_in_NOAA)/route_count * 100, 2)) + '%'
        else:
            route_cache_pct = '0%'
            route_NOAA_pct = '0%'
        
        points_in_cache = 0
        point_cache_zoom_total = 0
        points_in_NOAA = 0
        point_NOAA_zoom_total = 0
        point_cache_zoom_avg = 0
        point_NOAA_zoom_avg = 0
        for point in points:
            if point.zoom_level < 9:
                points_in_cache = points_in_cache + 1
                point_cache_zoom_total = point_cache_zoom_total + point.zoom_level
            else:
                points_in_NOAA = points_in_NOAA + 1
                point_NOAA_zoom_total = point_NOAA_zoom_total + point.zoom_level
        if points_in_cache > 0:
            point_cache_zoom_avg = float(point_cache_zoom_total)/points_in_cache
        if points_in_NOAA > 0:
            point_NOAA_zoom_avg = float(point_NOAA_zoom_total)/points_in_NOAA
        point_count = points_in_cache + points_in_NOAA
        if point_count > 0:
            point_cache_pct = str(round(float(points_in_cache)/point_count * 100, 2)) + '%'
            point_NOAA_pct = str(round(float(points_in_NOAA)/point_count * 100, 2)) + '%'
        else:
            point_cache_pct = '0%'
            point_NOAA_pct = '0%'

        if complete_count > 0:
            c_route_drawn_count = completes.filter(map_status = "Route drawn").count()
            c_route_drawn_pct = str(round((float(c_route_drawn_count) / complete_count) * 100, 2) ) + '%'
            c_route_skipped_count = completes.filter(map_status = "Skipped").count()
            c_route_skipped_pct = str(round((float(c_route_skipped_count) / complete_count) * 100, 2)) + '%'

            c_point_drawn_count = completes.filter(act_status = "Point plotted").count()
            c_point_drawn_pct = str(round((float(c_point_drawn_count) / complete_count) * 100, 2)) + '%'
            c_point_skip_count = completes.filter(act_status = "Skipped").count()
            c_point_skip_pct = str(round((float(c_point_skip_count) / complete_count) * 100, 2)) + '%'
        else:
            c_route_drawn_count = 0
            c_route_drawn_pct = '0%'
            c_route_skipped_count = 0
            c_route_skipped_pct = '0%'

            c_point_drawn_count = 0
            c_point_drawn_pct = '0%'
            c_point_skip_count = 0
            c_point_skip_pct = '0%'
        if incomplete_count > 0:
            i_route_drawn_count = incompletes.filter(map_status = "Route drawn").count()
            i_route_drawn_pct = str(round((float(i_route_drawn_count) / incomplete_count) * 100, 2)) + '%'
            i_route_started_count = incompletes.filter(map_status = "Started").count()
            i_route_started_pct = str(round((float(i_route_started_count) / incomplete_count) * 100, 2)) + '%'
            i_route_not_start_count = incompletes.filter(user_id = '').count()
            i_route_not_start_pct = str(round((float(i_route_not_start_count) / incomplete_count) * 100, 2)) + '%'

            i_point_drawn_count = incompletes.filter(act_status = "Point plotted").count()
            i_point_drawn_pct = str(round((float(i_point_drawn_count) / incomplete_count) * 100, 2)) + '%'
            i_point_not_start_count = incompletes.filter(act_status = "Not yet started").count()
            i_point_not_start_count = i_point_not_start_count + incompletes.filter(user_id = '').count()
            i_point_not_start_pct = str(round((float(i_point_not_start_count) / incomplete_count) * 100, 2)) + '%'
        else:
            i_route_drawn_count = 0
            i_route_drawn_pct = '0%'
            i_route_started_count = 0
            i_route_started_pct = '0%'
            i_route_not_start_count = 0
            i_route_not_start_pct = '0%'

            i_point_drawn_count = 0
            i_point_drawn_pct = '0%'
            i_point_not_start_count = 0
            i_point_not_start_pct = '0%'
            
        c_routes_total = routes.filter(survey__complete = True).count()
        i_routes_total = routes.filter(survey__complete = False).count()
        c_points_total = points.filter(survey__complete = True).count()
        i_points_total = points.filter(survey__complete = False).count()
        
        if c_routes_total > 0 :
            c_ratio = round(float(c_points_total)/c_routes_total, 2)
        else :
            c_ratio = 0
        if i_routes_total > 0 :
            i_ratio = round(float(i_points_total)/i_routes_total, 2)
        else :
            i_ratio = 0

        summary = [
            {'key': 'Completed', 'value' : complete_count, 'pct': complete_pct, 'style': ''},
            {'key': 'Mapped (Complete)', 'value' : mapped_count, 'pct': mapped_pct, 'style': 'color: #AAA'},
            {'key': 'Skipped (Complete)', 'value' : skipped_count, 'pct': skipped_pct, 'style': 'color: #AAA'},
            {'key': 'Incomplete', 'value' : incomplete_count, 'pct': incomplete_pct, 'style': ''},
            {'key': 'Total', 'value': survey_count, 'pct': '', 'style': 'font-weight: bold'}
        ]
        
        c_route_summary = [
            {'key': 'Drawn', 'value' : c_route_drawn_count, 'pct' : c_route_drawn_pct, 'style': '' },
            {'key': 'Skipped', 'value' : c_route_skipped_count, 'pct': c_route_skipped_pct, 'style': ''},
            {'key': 'Total', 'value' : complete_count, 'pct': '', 'style': 'font-weight: bold'}
        ]
        
        i_route_summary = [
            {'key': 'Drawn', 'value': i_route_drawn_count, 'pct': i_route_drawn_pct, 'style': ''},
            {'key': 'Started', 'value' : i_route_started_count, 'pct': i_route_started_pct, 'style': ''},
            {'key': 'Not Started', 'value' : i_route_not_start_count, 'pct': i_route_not_start_pct, 'style': ''},
            {'key': 'Total', 'value' : incomplete_count, 'pct': '', 'style': 'font-weight: bold'}
        ]
        
        c_point_summary = [
            {'key': 'Placed', 'value' : c_point_drawn_count, 'pct': c_point_drawn_pct, 'style': ''},
            {'key': 'Skipped', 'value' : c_point_skip_count, 'pct': c_point_skip_pct, 'style': ''},
            {'key': 'Total', 'value' : complete_count, 'pct': '', 'style': 'font-weight: bold'}
        ]
        
        i_point_summary = [
            {'key': 'Placed', 'value' : i_point_drawn_count, 'pct': i_point_drawn_pct, 'style': ''},
            {'key': 'Not Started', 'value' : i_point_not_start_count, 'pct': i_point_not_start_pct, 'style': ''},
            {'key': 'Total', 'value' : incomplete_count, 'pct': '', 'style': 'font-weight: bold'}
        ]
        
        zoom_level_summary = [
            {'key': 'Routes drawn in cached map', 'value' : routes_in_cache, 'pct': route_cache_pct, 'style': ''},
            {'key': 'Routes drawn in NOAA map', 'value' : routes_in_NOAA, 'pct': route_NOAA_pct, 'style': ''},
            {'key': 'Points drawn in cached map', 'value' : points_in_cache, 'pct': point_cache_pct, 'style': ''},
            {'key': 'Points drawn in NOAA map', 'value' : points_in_NOAA, 'pct': point_NOAA_pct, 'style': ''}
        ]
        
        ratio_summary = [
            {'key': 'Complete', 'value' : c_ratio, 'points': c_points_total, 'routes': c_routes_total, 'style': ''},
            {'key': 'Incomplete', 'value' : i_ratio, 'points': i_points_total, 'routes': i_routes_total , 'style': ''}
        ]
            
    else:
        summary = []
        c_route_summary = []
        i_route_summary = []
        c_point_summary = []
        i_point_summary = []
        zoom_level_summary = []
        ratio_summary = []
    
    return render_to_response( template, RequestContext(request,{'import_form': import_form, 'export_form': export_form, 'month': month, 'summary': summary, 'c_route_summary': c_route_summary, 'i_route_summary': i_route_summary, 'c_point_summary': c_point_summary, 'i_point_summary': i_point_summary, 'zoom_level_summary': zoom_level_summary, 'ratio_summary': ratio_summary, 'time_period': time_period}))

'''
Accessed from the Survey Management Admin interface 
Returns a rendered template that displays the form for Exporting a Survey and a form for Importing a Survey
'''
def port_surveys(request, template='port_surveys.html'):
    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'GET':
        return HttpResponse('Action not permitted', status=403)
    export_form = ExportSurveysForm()
    import_form = ImportSurveysForm()
    return render_to_response( template, RequestContext(request,{'import_form': import_form, 'export_form': export_form}))        
 
'''
Accessed when user clicks the Export Surveys button
Creates a fixture from all the completed surveys
Returns a response that contains the fixture as a .json file
'''
def export_surveys(request):

    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'POST':
        return HttpResponse('Action not permitted', status=403)
    form = ExportSurveysForm(request.POST)
        
    if not form.is_valid():
        return render_to_response( template, RequestContext( request, {'export_form':form} ) )
    #compile a fixture from all the completed surveys
    fixture_text = compile_survey_fixture()
    response = HttpResponse(fixture_text, mimetype='application/json')
    #return fixture with <staff_username>_<today's date>.json convention
    username = clean_username(User.objects.get(username = request.user).first_name)
    response['Content-Disposition'] = 'attachment; filename=%s_%s.json' % (username, datetime.date.today())
    return response

'''
Accessed when user clicks the Export Shapefile button
Creates a shapefile from all the completed surveys' geometries
Returns a response that contains the shapefile
'''
def export_points_shapefile(request, month='all'):
    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'POST':
        return HttpResponse('Action not permitted', status=403)
    form = ExportSurveysForm(request.POST)
        
    if not form.is_valid():
        return render_to_response( template, RequestContext( request, {'export_form':form} ) )
    #compile a queryset of shapes from the completed surveys
    completed_points = compile_completed_points(month)    
    shp_response = ShpResponder(completed_points)
    username = clean_username(User.objects.get(username = request.user).first_name)
    shp_response.file_name = '%s_%s_points_%s' % (username, month, datetime.date.today())

    return shp_response()
    
'''
Accessed when user clicks the Export Shapefile button
Creates a shapefile from all the completed surveys' geometries
Returns a response that contains the shapefile
'''
def export_routes_shapefile(request, month='all'):
    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'POST':
        return HttpResponse('Action not permitted', status=403)
    form = ExportSurveysForm(request.POST)
        
    if not form.is_valid():
        return render_to_response( template, RequestContext( request, {'export_form':form} ) )
    #compile a queryset of shapes from the completed surveys
    completed_routes = compile_completed_routes(month)    
    shp_response = ShpResponder(completed_routes)
    username = clean_username(User.objects.get(username = request.user).first_name)
    shp_response.file_name = '%s_%s_routes_%s' % (username, month, datetime.date.today())
    return shp_response()
 
'''
Accessed when user clicks the Export CSVs button
Creates a CSV for each interview from all the completed surveys' answers
Returns a response that contains a zipfile of all of the CSVs.
'''
def export_csv(request, month='all', template='port_surveys.html'):

    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'POST':
        return HttpResponse('Action not permitted', status=403)
    form = ExportSurveysForm(request.POST)
    if not form.is_valid():
        return render_to_response( template, RequestContext( request, {'export_form':form} ) )

    fields = []
    for field in SurveyStatus._meta.fields:
        fields.append({'table': 'survey', 'name': field.name})
        
    for field in Route._meta.fields:
        if field.name != 'survey' and field.name != 'geometry' :
            if field.name == 'id' or field.name == 'zoom_level' or field.name == 'created':
                fields.append({'table': 'route', 'name': 'route_' + field.name})
            else:
                fields.append({'table': 'route', 'name': field.name})
        
    for field in ActivityPoint._meta.fields:
        if field.name != 'survey' and field.name != 'geometry' :
            if field.name == 'id' or field.name == 'zoom_level' or field.name == 'created':
                fields.append({'table': 'activity_point', 'name': 'point_' + field.name})
            else:
                fields.append({'table': 'activity_point', 'name': field.name})

    #compile a queryset of users from the completed surveys
    data_rows = compile_data_rows(fields, month)
    
    if data_rows.__len__() > 0:
        if data_rows[0].__class__() != []:
            return data_rows[0]

        username = clean_username(User.objects.get(username = request.user).first_name)
        filename = slugify('%s_%s_map-data_%s' % (username, month, datetime.date.today())) + '.csv'
        
        response = HttpResponse(mimetype='text/csv')
        response['Content-Disposition'] = 'attachment;filename="' + filename + '"'

        writer = csv.writer(response)
        writer.writerows(data_rows)

        return response
    
    else:
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        if month == 'all':
            ret_month = month
        else:
            ret_month = months[int(month)]
        return HttpResponse('No complete data available for ' + ret_month + '. Please return to the <a href="../../../">dashboard</a>.' , status=500)

#User input may contain spaces or special characters.
def clean_username(ugly_str):
    for char in ugly_str:
        if not (char.isalnum() or char == '-' or char == '_'):
            bad_index = ugly_str.find(char)
            clean_str = clean_username(ugly_str[0:bad_index]+ugly_str[bad_index+1:])
            return clean_str
    return ugly_str

    
'''
Called from export_survey
Compiles and returns the text of a fixture that embodies all the completed surveys in the database
'''  
def compile_survey_fixture():
    survey_objects = []
    survey_objects.extend(status for status in SurveyStatus.objects.all())
    survey_objects.extend(route for route in Route.objects.all())
    survey_objects.extend(point for point in ActivityPoint.objects.all())

    #serialize the survey objects into json 
    fixture_text = serializers.serialize('json', survey_objects, indent=2)
    return fixture_text
  
def compile_completed_points(month):
    if month == 'all':
        points = ActivityPoint.objects.filter(survey__complete = True)
    else:
        points = ActivityPoint.objects.filter(survey__complete = True, survey__month_id = month)
    return points
    
def compile_completed_routes(month):
    if month == 'all':
        routes = Route.objects.filter(survey__complete = True)
    else:
        routes = Route.objects.filter(survey__complete = True, survey__month_id = month)
    return routes

def compile_data_rows(fields, month):
    data_rows = []
    header_row = []
    for field in fields:
        header_row.append(field['name'])
    data_rows.append(header_row)
    if month == 'all':
        surveys = SurveyStatus.objects.filter(complete = True)
    else :
        surveys = SurveyStatus.objects.filter(complete = True, month_id = month)
    for survey in surveys:
        points = ActivityPoint.objects.filter(survey = survey).order_by('id')
        if points.count() > 0:
            for point in points:
                data_rows.append(create_row({'survey':survey, 'fields':fields, 'point': point}))
        else:
            data_rows.append(create_row({'survey':survey, 'fields':fields, 'point': None}))
    return data_rows
    
def create_row(row_data):
    row = []
    for field in row_data['fields']:
        if field['name'][:6] == 'point_' or field['name'][:6] == 'route_':
            name = field['name'][6:]
        else:
            name = field['name']
        if row_data['survey'].map_status == 'Route drawn':
            route = Route.objects.get(survey = row_data['survey'])
        else:
            route = None
        if field['table'] == 'survey':
            value = row_data['survey'].__getattribute__(name)
            if name == 'month_id':
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                month = months[int(value)]
                row.append(month)
            elif type(value) is datetime.datetime:
                row.append(clean_datetime(value))
            else:
                row.append(str(value))
        if field['table'] == 'route':
            if route:
                value = route.__getattribute__(name)
                if type(value) is datetime.datetime:
                    row.append(clean_datetime(value))
                else:
                    row.append(str(value))
            else:
                row.append('')
        if field['table'] == 'activity_point':
            if row_data['point']:
                value = row_data['point'].__getattribute__(name)
                if type(value) is datetime.datetime:
                    row.append(clean_datetime(value))
                else:
                    row.append(str(value))
            else:
                row.append('')
    return row
    
def clean_datetime(value):
    year = str(value.year)
    if value.month < 10:
        month = '0' + str(value.month)
    else:
        month = str(value.month)
    if value.day < 10:
        day = '0' + str(value.day)
    else:
        day = str(value.day)
    if value.hour < 10:
        hour = '0' + str(value.hour)
    else:
        hour = str(value.hour)
    if value.minute < 10:
        minute = '0' + str(value.minute)
    else:
        minute = str(value.minute)
    date_string = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    return date_string

'''
Uploads a survey fixture file from an admin enabled user.
Calls loaddata on that fixture, loading into the database.
Note: This action will overwrite data entries for cases in which the primary key is the same but the data is different.
'''
def import_surveys(request, template='surveys_imported.html'):
    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'POST':
        return HttpResponse('Action not permitted', status=403)
    form = ImportSurveysForm(request.POST, request.FILES)
    #check form for validity
    if not form.is_valid():
        return render_to_response( 'port_surveys.html', RequestContext( request, {'import_form':form} ) )
    #retrieve file
    survey_file = request.FILES['file']
    #copy contents of survey file to a temporary fixture file
    tempfile = copy_to_tempfile(survey_file)
    #call loaddata on the temporary fixture file, and collect the output
    success, output = load_fixture(tempfile)
    #render a template informing the admin user that the fixture has been loaded (or not)
    return render_to_response( template, RequestContext( request, {'fixture': survey_file, 'output': output, 'success': success} ) )
    
'''    
Called form import_surveys
Copies the contents of the imported fixture into a temporary file
(This will allow the application to call loaddata on that fixture)
'''
def copy_to_tempfile(fixture):
    import tempfile
    #create temporary file for storing fixture data
    __, temp_file = tempfile.mkstemp(suffix='.json')
    dest = open(temp_file, 'wb+')
    #write fixture data to temporary file
    for chunk in fixture.chunks():
        dest.write(chunk)
    #close temporary file and return the path name
    dest.close()
    return dest.name
    
'''    
The following is (still) a bit of a hack to retrieve the output from loaddata
Called from import_surveys
Calls loaddata on given fixture 
Returns the an indication of success and the last line of the output generated by the loaddata call
'''
def load_fixture(fixture):
    import tempfile, sys
    from django.core import management
    #create a temporary location to store the output generated by loaddata
    tempdir = tempfile.mkdtemp()
    tempout = os.path.join(tempdir, 'temp.txt')
    #call loaddata on the temporary fixture file, storing any output from the loaddata call into a temporary location
    
    #the following lines temporarily redirect the output from stdout to tempout 
    saveout = sys.stdout
    fsock = open(tempout, 'w')
    sys.stdout = fsock
    #this output rediction allows us to capture the output generated by loaddata
    #management.call_command('loaddata', fixture, verbosity=1)
    
    from django.core.management.commands.loaddata import Command
    klass = Command()
    klass.execute(fixture, verbosity=1)
    
    #and the following lines redirect the output back to stdout
    sys.stdout = saveout     
    fsock.close()
    
    #read and store the last line from the output file 
    #(this should be something similar to: 'Installed xx object(s) from xx fixture(s)')
    outfile_reader = open(tempout, 'r')
    output_all = outfile_reader.readlines()
    output = output_all[-1]

    #the following is a pretty lame way of determining whether the fixture loaded anything or not
    #but i'm not sure how else this might be accomplished since the management.call_command to loaddata
    #doesn't seem to provide any additional information about its success or failure
    if 'Installed' in output:
        success = True
    else:
        success = False
        
    return success, output
    