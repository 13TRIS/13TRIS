from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .models import Friend, Profile


def login_view(request):
    context = {}
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.info(request, 'Username or password is incorrect')
            return render(request, 'tetris_app/login-view.html')
    return render(request, 'tetris_app/login-view.html')


def logout_user(request):
    logout(request)
    return redirect('login')


def register_view(request):
    form = UserCreationForm()
    context = {'form': form}
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        print("post")
        if form.is_valid():
            print("valid")
            user = form.cleaned_data.get('username')
            messages.success(request, 'An account has been created for ' + user)
            form.save()
            return redirect('login')
    return render(request, 'tetris_app/register-view.html', context)


def validate_username(request):
    """Check username availability"""
    username = request.GET.get('username', None)
    print(len(username.strip()))
    taken = len(username.strip()) < 1 or User.objects.filter(username__iexact=username).exists()
    response = {
        'is_taken': taken
    }
    return JsonResponse(response)


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


def update_friend(request, operation, username):
    new_friend = User.objects.get(username=username)
    print(type(new_friend))
    if operation == 'add':
        Friend.make_friend(request.user, new_friend)
    if operation == 'remove':
        Friend.lose_friend(request.user, new_friend)
    return redirect('home')

