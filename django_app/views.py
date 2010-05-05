from django.shortcuts import render_to_response
from django.template import RequestContext

def intro(request):
    interview_id  = request.GET.get('id')
    vessel  = request.GET.get('vessel')
    request.session['interview_id'] = interview_id
    request.session['vessel'] = vessel
    context = RequestContext(request)
    return render_to_response('intro.html', {'interview_id':interview_id,'vessel':vessel})
    
def test(request):    
    return render_to_response('test.html')