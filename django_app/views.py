from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse

def intro(request):
    if not request.GET.has_key('id'):    
        return HttpResponse('We\'re sorry, this section is not accessible without providing the proper information' , status=500)
    interview_id  = request.GET.get('id')
    vessel  = request.GET.get('vessel')
    month = request.GET.get('month')
    request.session['interview_id'] = interview_id
    request.session['vessel'] = vessel
    request.session['month'] = month
    context = RequestContext(request)
    return render_to_response('intro.html', {'interview_id':interview_id,'vessel':vessel,'month':month})
    
def test(request):    
    return render_to_response('test.html')

def style_demo(request):
    return render_to_response('style_demo.html')
    