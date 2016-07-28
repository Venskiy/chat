from django.shortcuts import HttpResponse

import json

def json_response(obj):
    response = HttpResponse(json.dumps(obj), content_type='application/json')

    # TODO remove this in production
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'POST, GET'
    response['Access-Control-Allow-Headers'] = '*'

    return response
