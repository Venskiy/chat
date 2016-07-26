from django.shortcuts import render, redirect
from django.contrib.auth.models import User

# Create your views here.

def home(request):
    if not request.user.is_authenticated():
        return redirect('/accounts/login')

    context = {
        'users': User.objects.all()
    }
    return render(request, 'chat_homepage.html', context)
