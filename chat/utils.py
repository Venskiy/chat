from django.shortcuts import HttpResponse

import json

def json_response(obj):
    response = HttpResponse(json.dumps(obj, default=date_handler), content_type='application/json')

    # TODO remove this in production
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'POST, GET'
    response['Access-Control-Allow-Headers'] = '*'

    return response


def date_handler(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    else:
        raise TypeError
