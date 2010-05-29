from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseRedirect
import datetime

from draw_app.models import SurveyStatus

def intro(request):
    
    if request.GET.has_key('continue'):
    
        already_complete = SurveyStatus.objects.filter(survey_id = request.session['interview_id'], complete = True)
        
        if already_complete:
            return HttpResponseRedirect('http://www.maboatersurvey.com/thanks.htm')
        else:    
            return HttpResponseRedirect('/draw/')
            
    elif request.GET.has_key('skip'):
        skipped_survey = SurveyStatus.objects.get_or_create(survey_id=request.session['interview_id'])
        #Save skip status here
        skipped_survey[0].user_type=request.session['interview_id'][0]
        skipped_survey[0].user_id=request.session['interview_id'][1:7]
        skipped_survey[0].month=request.session['interview_id'][-2:]
        skipped_survey[0].map_status = 'Skipped'
        skipped_survey[0].act_status = 'Skipped'
        skipped_survey[0].complete = True
        skipped_survey[0].complete_time = datetime.datetime.now()
        skipped_survey[0].save()
        return HttpResponseRedirect('http://www.maboatersurvey.com/thanks.htm')

    if not request.GET.has_key('id'):    
        return HttpResponse('We\'re sorry, this section is not accessible without providing the proper information' , status=500)

    interview_id  = request.GET.get('id')
    vessel  = request.GET.get('vessel')
    month = request.GET.get('month')
    request.session['interview_id'] = interview_id
    request.session['vessel'] = vessel
    request.session['month'] = month
    context = RequestContext(request)
    
    already_complete = SurveyStatus.objects.filter(survey_id = request.session['interview_id'], complete = True)
        
    if already_complete:
        return HttpResponseRedirect('http://www.maboatersurvey.com/thanks.htm')
    else: 
        return render_to_response('intro.html', {'interview_id':interview_id,'vessel':vessel,'month':month})

def test(request):    
    return render_to_response('test.html')    