from django.shortcuts import HttpResponse

import json

def json_response(obj):
    return HttpResponse(json.dumps(obj), content_type="application/json")
