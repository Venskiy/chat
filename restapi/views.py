from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view

from restapi.serializers import UserSerializer


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
