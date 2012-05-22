from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.shortcuts import get_object_or_404
from django.shortcuts import render_to_response
from shortcuts import render_to_geojson
from utils.geojson_encode import *
import datetime

from models import *

def status(request):
    if request.method == 'POST':        
        #Make sure we were passed a feature
        if not request.POST.has_key('status'):
            return HttpResponse('{"status_code":"-1",  "success":"false",  "message":"Expected \'feature\'"}', status=403)
        import simplejson
        status = simplejson.loads(request.POST.get('status')) 
         
         #It must be a new status, create it                                 
        result = '{"status_code":"-1",  "success":"false",  "message":"Error saving"}'
        try: 
            if status.get('field') == 'map_status':
                up_status = SurveyStatus.objects.get(survey_id=request.session['interview_id'])
                up_status.map_status=status.get('val')
                up_status.save()
            elif status.get('field') == 'act_status':
                up_status = SurveyStatus.objects.get(survey_id=request.session['interview_id'])
                up_status.act_status=status.get('val')
                up_status.save()
            elif status.get('field') == 'complete':
                up_status = SurveyStatus.objects.get(survey_id=request.session['interview_id'])
                up_status.complete=status.get('val')
                up_status.complete_time = datetime.datetime.now()
                up_status.save()
                
        except Exception, e:
            return HttpResponse(result + e.message, status=500)

        result = {
            "status_code":1,  
            "success":True, 
            "message":"Saved successfully",
            "status": up_status
        }              
        return HttpResponse(geojson_encode(result))                

def draw(request):   
    if not request.session.has_key('interview_id'):    
        return HttpResponse('We\'re sorry, the mapping portion of this survey cannot be opened.  If you believe this is an error, you can call 617-737-2600 ext. 102, or email <a href="mailto:help@seaplan.org">help@seaplan.org</a>.' , status=500)
    params = {
        'interview_id': request.session['interview_id']
    }
    if settings.GMAPS_API_KEY.__len__() > 0:
        params['GMAPS_API_KEY'] = settings.GMAPS_API_KEY
    
    already_complete = SurveyStatus.objects.filter(survey_id = request.session['interview_id'], complete = True)
        
    if already_complete:
        return HttpResponseRedirect('/complete/')
    
    started_survey = SurveyStatus.objects.get_or_create(survey_id=request.session['interview_id'])
    #Save status here
    started_survey[0].user_type=request.session['interview_id'][0]
    started_survey[0].user_id=request.session['interview_id'][1:-2]
    started_survey[0].month_id=request.session['interview_id'][-2:]
    started_survey[0].map_status = 'Started'
    started_survey[0].act_status = 'Not yet started'
    started_survey[0].save()
    
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    params['month'] = months[int(started_survey[0].month_id) - 1]
    
    Route.objects.filter(survey=request.session['interview_id']).delete()
    # ActivityArea.objects.filter(survey_id=request.session['interview_id']).delete()
    ActivityPoint.objects.filter(survey=request.session['interview_id']).delete()
    
    return render_to_response('draw.html', RequestContext(request, params))

def draw_settings (request):
    pass

'''
Shape web service - 
GET: filter by interview group: 'group_id'
POST - expects {'feature':{geometry, group_id, resource_id, boundary_n, boundary_s, boundary_e, boundary_w}}
DELETE - expects a shape id /shapes/id or resource_id param
'''
def shapes(request, id=None):  

    if request.method == 'POST':        
        #Make sure we were passed a feature
        if not request.POST.has_key('feature'):
            return HttpResponse('{"status_code":"-1",  "success":"false",  "message":"Expected \'feature\'"}', status=403)
        import simplejson
        feat = simplejson.loads(request.POST.get('feature'))        
        
        #It must be a new shape, create it                                 
        result = '{"status_code":"-1",  "success":"false",  "message":"Error saving"}'
        try:
            geom = GEOSGeometry(feat.get('geometry'), srid=settings.CLIENT_SRID)
            geom.transform(settings.SERVER_SRID)     
            if feat.get('type') == 'route':
                factors = feat.get('factors')
                other_factor = feat.get('other_factor')
                if other_factor == '':
                    other_factor = None
                new_shape = Route(
                    survey = SurveyStatus.objects.get(survey_id=feat.get('survey_id')),
                    geometry = geom,
                    zoom_level = feat.get('zoom_level')
                )
                status = SurveyStatus.objects.get(survey_id=feat.get('survey_id'))
                status.map_status = 'Route drawn'
                status.save()
            # elif feat.get('type') == 'act_area':
                # new_shape = ActivityArea(
                    # survey_id = SurveyStatus.objects.get(survey_id=feat.get('survey_id')),
                    # geometry = geom,
                    # primary_activity = feat.get('primary_act'),
                    # duration = feat.get('duration'),
                    # rank = feat.get('rank'),
                    # alternate_activity_type = feat.get('alt_act_type'),
                # )    
                # status = SurveyStatus.objects.get(survey_id=feat.get('survey_id'))
                # status.act_status = 'Area drawn'
                # status.save()
            elif feat.get('type') == 'act_point':
                activities = feat.get('activities')
                if activities['other']:
                    other_act = activities['other']
                else:
                    other_act = None
                fish_targets = feat.get('fish_tgts')
                if fish_targets and not fish_targets['fish-other'] == False:
                    fish_other = fish_targets['fish-other']
                else:
                    fish_other = None
                if not fish_targets:
                    fish_targets = {
                        'striped-bass': False,
                        'bluefish': False,
                        'flounder': False,
                        'cod': False,
                        'haddock': False,
                        'mackerel': False,
                        'scup': False,
                        'tautog': False,
                        'tuna': False,
                        'shark': False,
                        'billfish': False,
                        'wahoo': False
                    }
                view_targets = feat.get('view_tgts')
                if view_targets and not view_targets['view-other'] == False:
                    view_other = view_targets['view-other']
                else :
                    view_other = None
                if not view_targets:
                    view_targets = {
                        'whales': False,
                        'dolphin-porpoises': False,
                        'sea-turtles': False,
                        'birds': False,
                        'seals': False
                    }
                dive_targets = feat.get('dive_tgts')
                if dive_targets and not dive_targets['dive-other'] == False:
                    dive_other = dive_targets['dive-other']
                else :
                    dive_other = None
                if not dive_targets:
                    dive_targets = {
                        'exploring': False,
                        'wrecks': False,
                        'fishing': False
                    }
  
                new_shape = ActivityPoint(
                    survey     = SurveyStatus.objects.get(survey_id=feat.get('survey_id')),
                    geometry   = geom,
                    fishing    = activities['fishing'],
                    viewing    = activities['wildlife-viewing'],
                    diving     = activities['diving'],
                    swimming   = activities['swimming'],
                    relaxing   = activities['relaxing'],
                    other_act  = other_act,
                    f_strbass  = fish_targets['striped-bass'],
                    f_bluefish = fish_targets['bluefish'],
                    f_flounder = fish_targets['flounder'],
                    f_atl_cod  = fish_targets['cod'],
                    f_haddock  = fish_targets['haddock'],
                    f_mackerel = fish_targets['mackerel'],
                    f_scup     = fish_targets['scup'],
                    f_tautog   = fish_targets['tautog'],
                    f_tuna     = fish_targets['tuna'],
                    f_shark    = fish_targets['shark'],
                    f_billfish = fish_targets['billfish'],
                    f_wahoo    = fish_targets['wahoo'],
                    f_other    = fish_other,
                    v_whales   = view_targets['whales'],
                    v_dol_porp = view_targets['dolphin-porpoises'],
                    v_turtles   = view_targets['sea-turtles'],
                    v_birds    = view_targets['birds'],
                    v_seals    = view_targets['seals'],
                    v_other    = view_other,
                    d_fishing  = dive_targets['fishing'],
                    d_wrecks   = dive_targets['wrecks'],
                    d_explore  = dive_targets['exploring'],
                    d_other    = dive_other,
                    zoom_level = feat.get('zoom_level')
                )  
                status = SurveyStatus.objects.get(survey_id=feat.get('survey_id'))
                status.act_status = 'Point plotted'
                status.save()
            new_shape.save() 

        except Exception, e:
            return HttpResponse(result + e.message, status=500)

        result = {
            "status_code":1,  
            "success":True, 
            "message":"Saved successfully",
            "feature": new_shape
        }              
        return HttpResponse(geojson_encode(result))                  
    
'''
Shape validation and clipping

HTTP error codes
403 - interview already completed
500 - exception raised

Result status codes
0 - valid
1 - invalid, missing arguments
2 - shape not valid
3 - overlapped existing shape
'''    
def validate_shape(request):
    cur_activity = None    
    try:
        survey_id = request.REQUEST['survey_id']
        type = request.REQUEST['type']
        shape_json = request.REQUEST['geometry']        
    except Exception, e:
        return gen_validate_response(1, 'Invalid, missing arguments. survey_id, type and geometry are required', None)

    try:    
        new_shape = GEOSGeometry( shape_json, srid=settings.CLIENT_SRID )
        #Verify route is valid
        if type == 'route':
            if (not new_shape.geom_type == 'LineString') or (not new_shape.valid):
                return gen_validate_response(2, 'Route is not valid', new_shape, type)        
        #Verify activity is valid
        elif type == 'act_area':
            if new_shape.area == 0:
                return gen_validate_response(2, 'Shape is not valid', None, type)                
            if (not new_shape.geom_type == 'Polygon') or (not new_shape.valid):
                return gen_validate_response(2, 'Shape is not valid', new_shape, type)
        elif type == 'act_point' or type == 'alt_act_point':
            if (not new_shape.geom_type == 'Point') or (not new_shape.valid):
                return gen_validate_response(2, 'Activity point is not valid', new_shape, type)
            
    except Exception, e:
        return gen_validate_response(2, 'Shape is not valid', None, type)
            
    return gen_validate_response(0, 'Valid shape', new_shape, type)                               

'''
Utility function for generating manipulator response 
'''
def gen_validate_response(code, message, geom, type):
    if geom:
        geom.transform( settings.CLIENT_SRID )
    result = {
        'status_code':code,
        'message':message,
        'geom':geom,
        'type':type
    }
    return HttpResponse(geojson_encode(result))

@login_required
def report(request):
    if not request.user.is_superuser:
        return HttpResponse(status=405)

    import csv
    import simplejson
    a_points = ActivityPoint.objects.all()
    a_polys = ActivityPoly.objects.all()
    
    a_recs = {}
    a_recs[0] = {
        'id':'id',
        'date':'date',
        'drew_points':'drew_points',
        'points_drawn':'points_drawn (T or F)',
        'drew_polys':'drew_polys',
        'polys_drawn':'polys_drawn (T or F)'
    }
    for a_point in a_points:
        if a_recs.has_key(a_point.kn_user_id):
            a_rec = a_recs[a_point.kn_user_id]
            a_rec['points_drawn'] += 1
        else:
            a_recs[a_point.kn_user_id] = {
                'id':a_point.kn_user_id,
                'drew_points':1,    #numeric true
                'points_drawn':1,
                'drew_polys':0, #numeric false
                'polys_drawn':0,
                'date':str(a_point.creation_date)
            }
    for a_poly in a_polys:
        if a_recs.has_key(a_poly.kn_user_id):
            a_rec = a_recs[a_poly.kn_user_id]
            if a_rec['polys_drawn']:
                a_rec['polys_drawn'] += 1
            else:
                a_rec['drew_polys'] = 1 #numeric true
                a_rec['polys_drawn'] += 1
        else:
            a_recs[a_poly.kn_user_id] = {
                'id':a_poly.kn_user_id,
                'drew_points':0,    #numeric false
                'points_drawn':0,
                'drew_polys':1,     #numeric true
                'polys_drawn':1,
                'date':str(a_poly.creation_date)
            }
    response = HttpResponse(mimetype='text/csv')
    response['Content-Disposition'] = 'attachment; filename=or_coast_survey_geo_report.csv'
    writer = csv.writer(response)
    for id in a_recs.keys():
        writer.writerow(a_recs[id].values())
    return response

def complete_check(request):
    already_complete = SurveyStatus.objects.filter(survey_id = request.session['interview_id'], complete = True)
        
    if already_complete:
        result = {'is_complete': True}
    else:
        result = {'is_complete': False}
    
    return HttpResponse(json.dumps(result))
    