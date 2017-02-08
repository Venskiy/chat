from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view

from restapi.serializers import UserSerializer, ChatSerializer
from chat.models import Chat


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
        return HttpResponse('You are not loged in')

    user_chats = Chat.objects.filter(participants=request.user)
    serializer = ChatSerializer(user_chats, context={'request': request}, many=True)
    return Response(serializer.data)
