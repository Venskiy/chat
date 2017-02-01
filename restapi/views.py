from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status


@api_view(['GET'])
def get_info_about_authenticated_user(request):
    if not request.user.is_authenticated():
        return Response('You are not logged in', status=status.HTTP_400_BAD_REQUEST)

    context = {
        'user_id': request.user.id,
        'username': request.user.username
    }

    return Response(context)
