from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

import json

from chat.models import Message
from chat.utils import json_response

# Create your views here.

def home(request):
    if not request.user.is_authenticated():
        return redirect('/accounts/login')

    return render(request, 'index.html', {})


def get_all_users(request):
    context = {
        'users': list(User.objects.all().exclude(username=request.user).values('username'))
    }

    return json_response(context)


@csrf_exempt
def send_message_api(request):
    api_key = request.POST.get("api_key")

    if api_key != settings.API_KEY:
        return json_response({"error": "Please pass a correct API key."})

    message_text = request.POST.get("message")

    message_instance = Message()
    message_instance.text = message_text
    message_instance.save()

    return json_response({'status': 'ok'})
