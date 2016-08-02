from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

import json

from chat.models import Message, Chat
from chat.utils import json_response

# Create your views here.

def home(request):
    if not request.user.is_authenticated():
        return redirect('/accounts/login')

    return render(request, 'index.html', {})



def get_current_user_api(request):
    user = request.user

    context = {
        'user_id': user.id,
        'userrname': user.username
    }

    return json_response(context)


def get_all_users_api(request):
    if not request.user.is_authenticated():
        return HttpResponse('You are not loged in')

    all_users = User.objects.all()
    users = list(all_users.exclude(username=request.user).values('username'))

    context = {
        'users': users
    }

    return json_response(context)


def get_user_chats_api(request):
    if not request.user.is_authenticated():
        return HttpResponse('You are not loged in')

    user_chats = Chat.objects.filter(participants=request.user)

    chats = []
    for user_chat in user_chats:
        chat_id = user_chat.id

        interlocutor = user_chat.participants.exclude(id=request.user.id).first()
        interlocutor_id = interlocutor.id
        interlocutor_username = interlocutor.username

        chat = {
            'chat_id': chat_id,
            'last_message': user_chat.messages.latest('timestamp').text,
            'interlocutor_id': interlocutor_id,
            'interlocutor_username': interlocutor_username
        }

        chats.append(chat)

    context = {
        'chats': chats
    }

    return json_response(context)


def create_chat_api(request):
    if not request.user.is_authenticated():
        return HttpResponse('You are not loged in')

    username = request.GET.get('username')

    recipient = User.objects.get(username=username)

    chat = Chat.objects.create()
    chat.participants.add(request.user, recipient)

    return json_response({'chat_id': chat.id})


def load_chat_messages_api(request):
    if not request.user.is_authenticated():
        return HttpResponse('You are not loged in')

    chat_id = request.GET.get('chat_id')

    chat = Chat.objects.get(id=chat_id)
    chat_messages = list(chat.messages.all().values('text'))

    context = {
        'chat_messages': chat_messages
    }

    return json_response(context)


@csrf_exempt
def send_message_api(request):
    api_key = request.POST.get('api_key')

    if api_key != settings.API_KEY:
        return json_response({'error': 'Please pass a correct API key.'})

    sender_id = request.POST.get('sender_id')
    sender = User.objects.get(id=sender_id)
    message_text = request.POST.get('message')

    message_instance = Message()
    message_instance.sender = sender
    message_instance.text = message_text
    message_instance.save()

    chat_id = request.POST.get('chat_id')
    chat = Chat.objects.get(id=chat_id)
    chat.messages.add(message_instance)

    return json_response({'status': 'ok'})
