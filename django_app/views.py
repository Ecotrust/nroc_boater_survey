from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseRedirect
import datetime

from draw_app.models import *

def intro(request):

    if request.GET.has_key('continue'):
    
        if not request.session.has_key('interview_id'):    
            return HttpResponse('We\'re sorry, the mapping portion of this survey cannot be opened. <br /><b>Please check to be sure that your browser has cookies enabled</b> and use the back button to return to your survey. <br />If you believe this is an error, you can call 732-263-5662, or email <a href="mailto:ljordan@monmouth.edu">ljordan@monmouth.edu</a>.' , status=500)
    
        already_complete = SurveyStatus.objects.filter(survey_id = request.session['interview_id'], complete = True)
        
        if already_complete:
            return HttpResponseRedirect('/complete/')
        else:    
            return HttpResponseRedirect('/draw/')
            
    elif request.GET.has_key('skip'):
        
        already_complete = SurveyStatus.objects.filter(survey_id = request.session['interview_id'], complete = True)
        
        if already_complete:
            return HttpResponseRedirect('/complete/')
        else:    
            #clear out previous answers
            Route.objects.filter(survey=request.session['interview_id']).delete()
            # ActivityArea.objects.filter(survey_id=request.session['interview_id']).delete()
            ActivityPoint.objects.filter(survey_id=request.session['interview_id']).delete()    
        
            skipped_survey = SurveyStatus.objects.get_or_create(survey_id=request.session['interview_id'])
            #Save skip status here
            skipped_survey[0].user_type=request.session['interview_id'][0]
            skipped_survey[0].user_id=request.session['interview_id'][1:-2]
            skipped_survey[0].month_id=request.session['interview_id'][-2:]
            skipped_survey[0].map_status = 'Skipped'
            skipped_survey[0].act_status = 'Skipped'
            skipped_survey[0].complete = True
            skipped_survey[0].complete_time = datetime.datetime.now()
            skipped_survey[0].save()
            return HttpResponseRedirect('http://www.monmouth.edu/uciboatersurvey')

    if not request.GET.has_key('id'):    
        # return HttpResponse('We\'re sorry, the mapping portion of this survey cannot be opened.  If you believe this is an error, you can call 732-263-5662, or email <a href="mailto:ljordan@monmouth.edu">ljordan@monmouth.edu</a>.' , status=500)
        return HttpResponseRedirect('/admin/utils/dashboard/')

    interview_id  = request.GET.get('id')
    month_id = interview_id[-2:]
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    month = months[int(month_id) - 1]
    request.session['interview_id'] = interview_id
    context = RequestContext(request)

    survey_session = SurveyStatus.objects.get_or_create(survey_id=request.session['interview_id'])
        
    if survey_session[0].complete:
        return HttpResponseRedirect('/complete/')
    else: 
        
        return render_to_response('intro.html', {'interview_id':interview_id,'month':month})

def test(request):    
    return render_to_response('test.html')    
    
def detailed_instructions(request):
    return render_to_response('detailed_instructions.html')
    
def complete(request):
    return render_to_response('complete.html', {'interview_id':request.session['interview_id']})