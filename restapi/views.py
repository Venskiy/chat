from django.contrib.auth.models import User
from django.shortcuts import render
from django.core.paginator import Paginator
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view

import json

from restapi.serializers import UserSerializer, ChatSerializer, MessageSerializer
from chat.models import Chat, Message
from chat import constants


@api_view(['GET'])
def get_authenticated_user(request):
    if not request.user.is_authenticated():
        return Response('You are not logged in', status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
def get_all_users(request):
    if not request.user.is_authenticated():
        return Response('You are not logged in', status=status.HTTP_400_BAD_REQUEST)

    users = User.objects.all().exclude(username=request.user).order_by('date_joined')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_user_chats(request):
    if not request.user.is_authenticated():
        return Response('You are not logged in', status=status.HTTP_400_BAD_REQUEST)

    user_chats = Chat.objects.filter(participants=request.user)
    serializer = ChatSerializer(user_chats, context={'request': request}, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_chat(request):
    if not request.user.is_authenticated():
        return Response('You are not logged in', status=status.HTTP_400_BAD_REQUEST)

    data = request.data
    username = data['username']

    recipient = User.objects.get(username=username)

    chat = Chat.objects.filter(participants=recipient).filter(participants=request.user)
    if chat.exists():
        chat = chat.first()
        return Response({'type': constants.CHAT_ALREADY_EXISTS, 'chat_id': chat.id})

    chat = Chat.objects.create()
    chat.participants.add(request.user, recipient)
    initial_message = Message(text='{} started the conversation!'.format(request.user.username),
                              sender=request.user)
    initial_message.save()
    chat.messages.add(initial_message)

    serializer = ChatSerializer(chat, context={'request': request})

    return Response({'type': constants.CHAT_NEW, 'chat': serializer.data})


@api_view(['GET'])
def load_chat_messages(request):
    if not request.user.is_authenticated():
        return Response('You are not logged in', status=status.HTTP_400_BAD_REQUEST)

    page_number = int(request.GET.get('page'))
    chat_id = request.GET.get('chat_id')

    chat = Chat.objects.get(id=chat_id)

    if not chat.participants.filter(id=request.user.id).exists():
        return Response('You are not belong to this conversation', status=status.HTTP_400_BAD_REQUEST)

    paginator = Paginator(chat.messages.all(), constants.MESSAGES_PAGE_SIZE)
    messages = paginator.page(page_number)
    serializer = MessageSerializer(messages, many=True)

    hasMore = True
    if page_number == paginator.num_pages:
        hasMore = False

    context = {
        'chat_messages': serializer.data,
        'has_more_chat_messages': hasMore
    }

    return Response({'chat_messages': serializer.data,
                     'has_more_chat_messages': hasMore})
