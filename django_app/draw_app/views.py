from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.shortcuts import get_object_or_404
from django.shortcuts import render_to_response
from shortcuts import render_to_geojson
from utils.geojson_encode import *

from models import *

def draw(request):    
    if not request.session.has_key('interview_id'):    
        return HttpResponse('We\'re sorry, this section is not accessible without providing the proper information' , status=500)
    params = {
        'interview_id': request.session['interview_id'], 
        'vessel': request.session['vessel'],
        'GMAPS_API_KEY': settings.GMAPS_API_KEY,
        'month': request.session['month']
    }
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
            # activity = Activity.objects.get(pk=feat.get('activity_id'))
            if feat.get('type') == 'route':
                new_shape = Route(
                    survey_id = feat.get('survey_id'),
                    user_type = feat.get('survey_id')[0],
                    user_id = feat.get('survey_id')[1:7],
                    month = feat.get('survey_id')[-2:],
                    geometry = geom,
                    factors = feat.get('factors'),
                    other_factor = feat.get('other_factor'),
                )
            elif feat.get('type') == 'act_area':
                new_shape = ActivityArea(
                    survey_id = feat.get('survey_id'),
                    user_type = feat.get('survey_id')[0],
                    user_id = feat.get('survey_id')[1:7],
                    month = feat.get('survey_id')[-2:],
                    geometry = geom,
                    primary_activity = feat.get('primary_act'),
                    duration = feat.get('duration'),
                    rank = feat.get('rank'),
                    factors = feat.get('factors'),
                    other_factor = feat.get('other_factor'),
                    alternate_activity_type = feat.get('alt_act'),
                )    

            elif feat.get('type') == 'alt_act_area':
                new_shape = AltActArea(
                    survey_id = feat.get('survey_id'),
                    user_type = feat.get('survey_id')[0],
                    user_id = feat.get('survey_id')[1:7],
                    month = feat.get('survey_id')[-2:],
                    geometry = geom,
                    primary_activity = feat.get('primary_act'),
                    preferred_area = request.session['preferred_shape'],
                )     
            new_shape.save() 
            
            if feat.get('type') == 'act_area':
                request.session['preferred_shape'] = new_shape
                

            # import pdb
            # pdb.set_trace()
            
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
        user_id = request.REQUEST['user_id']
        activity_id = request.REQUEST['activity_id']
        shape_json = request.REQUEST['geometry']
        
        cur_activity =  Activity.objects.get(pk=activity_id)        
    except Exception, e:
        return gen_validate_response(1, 'Invalid, missing arguments. user_id, activity_id and geometry are required', None)

    try:    
        new_shape = GEOSGeometry( shape_json, srid=settings.CLIENT_SRID )
        if new_shape.area == 0:
            return gen_validate_response(4, 'Shape is not valid', None)                
        if not new_shape.valid:
            return gen_validate_response(2, 'Shape is not valid', new_shape)        
    except Exception, e:
        return gen_validate_response(2, 'Shape is not valid', None)
    
    try:        
        new_shape.transform( settings.SERVER_SRID )

        other_shapes = None
        if cur_activity.draw_type == 'point':
            other_shapes = ActivityPoint.objects.filter(kn_user_id=user_id, act=cur_activity)
        else:
            other_shapes = ActivityPoly.objects.filter(kn_user_id=user_id, act=cur_activity)                                                        

        #Error if new shape intersects
        for i, shape in enumerate( other_shapes.all() ):
            if new_shape.intersects( shape.geometry ):
                return gen_validate_response(3, 'New geometry overlaps existing shapes', None)
        
        return gen_validate_response(0, 'Valid shape', new_shape)                   
    except Exception, e:
        raise
        #return HttpResponse(result + e.message, status=500)

'''
Utility function for generating manipulator response 
'''
def gen_validate_response(code, message, geom):
    if geom:
        geom.transform( settings.CLIENT_SRID )
    result = {
        'status_code':code,
        'message':message,
        'geom':geom
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
