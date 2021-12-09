from django.contrib.auth import authenticate
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .models import *


# Create your views here.


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = User.objects.get(name=username, password=password)
        if user is not None:
            print("passt")
            return redirect('home')
    return render(request, 'tetris_app/login-view.html')


def register_view(request):
    if request.method == 'POST':
        print(request.POST.get('username'))
        print(request.POST.get('password'))
        user = User(name=request.POST.get('username'), password=request.POST.get('password1'))
        user.save()
        return redirect('login')
    return render(request, 'tetris_app/register-view.html')


# This has to be removed eventually
def homepage_view(request):
    return render(request, 'tetris_app/homepage-view.html')


# This has to be removed eventually
def faq_view(request):
    return render(request, 'tetris_app/FAQ-view.html')


# This has to be removed eventually
def impressum_view(request):
    return render(request, 'tetris_app/impressum-view.html')


# This has to be removed eventually
def datenschutz_view(request):
    return render(request, 'tetris_app/datenschutz-view.html')


# This has to be removed eventually
def game_solo_view(request):
    return render(request, 'tetris_app/game-solo-view.html')
