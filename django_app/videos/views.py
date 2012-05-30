from django.http import HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response
from models import Video

from django.conf import settings

def listVideos(request, video_template='videos.html'):
    return render_to_response(video_template, context_instance=RequestContext(request, {'MEDIA_URL':settings.MEDIA_URL, 'video_list':Video.objects.all()})) 

def showVideo(request, urlname, demo_template='video.html'):
    import string
    # 'player':settings.MEDIA_URL+'video_player/player.swf',
    video = {
        'player':settings.VIDEO_PLAYER,
        'file':settings.VIDEO_URL+settings.VIDEO_FILE+'.flv',
        'title':string.capwords(urlname.replace('_',' '))
    }
    return render_to_response('demo_video.html', {'video':video}, context_instance=RequestContext(request)) 
    # try:
        # video = Video.objects.get(urlname=urlname)
    # except:
        # return HttpResponse( "Video " + urlname + " does not exist.", status=404 )

    # return render_to_response(demo_template, {'videoplayer':settings.VIDEO_PLAYER, 'video':video}, context_instance=RequestContext(request))


def showVideoById(request, pk, video_template='video.html'):
    try:
        video = Video.objects.get(pk=pk)
    except:
        return HttpResponse( "Video does not exist.", status=404 )

    if not settings.VIDEO_PLAYER:
        return HttpResponse( "Server error - VIDEO_PLAYER is not defined.", status=500 )

    import os
    player_path = settings.MEDIA_ROOT + "../" + settings.VIDEO_PLAYER
    if not os.path.exists(player_path):
        return HttpResponse( "Server error - VIDEO_PLAYER does not exist <br/> should live at %s" % settings.VIDEO_PLAYER, status=500 )
    
    return render_to_response(video_template, {'videoplayer':settings.VIDEO_PLAYER, 'video':video}, context_instance=RequestContext(request)) 

