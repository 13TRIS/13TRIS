from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .models import Friend, History
from django.core import serializers
from django.http import HttpResponse


def get_friends_if_exists(request):
    try:
        if not request.user.is_authenticated:
            raise ObjectDoesNotExist
        friend = Friend.objects.get(current_user=request.user)
        args = friend.users.all()
        return args
    except ObjectDoesNotExist:
        return None


def get_leaderboard(request):
    try:
        try:
            page = max(int(request.GET.get('page', '1')), 1)
        except ValueError:
            page = 1
        data = serializers.serialize('json', History.objects.order_by('-score')[10 * (page - 1):10 * page])
        return HttpResponse(data, content_type='application/json')
    except ObjectDoesNotExist:
        return None


def set_leaderboard(request):
    try:
        if request.method == 'POST':
            if not request.user.is_authenticated:
                raise ObjectDoesNotExist
            history = History(score=request.POST.get('score', None), player=request.user)
            history.save()
            args = {
                'score_added': True
            }
        else:
            args = {
                'score_added': False
            }
        return JsonResponse(args)
    except ObjectDoesNotExist:
        args = {
            'score_added': False
        }
        return JsonResponse(args)


def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    context = {}
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.warning(request, 'Username or password is incorrect')
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


def user_profile(request, user):
    profile = User.objects.get(username=user).Profile
    return render(
        request,
        'tetris_app/view_profile.html',
        {
            "friends": get_friends_if_exists(request),
            "profile": profile,
            'history_top': History.objects.filter(player=profile.user).order_by('-score')[:10],
            'history_latest': History.objects.filter(player=profile.user).order_by('-date_of_score')[:10]
        })


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
    return render(
        request,
        'tetris_app/homepage-view.html',
        {
            'friends': get_friends_if_exists(request),
            'history': History.objects.order_by('-score')[:10]
        }
    )


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
    return render(request, 'tetris_app/game-solo-view.html', {'friends': get_friends_if_exists(request)})


def update_friend(request, operation, username):
    try:
        if request.user.is_authenticated:
            new_friend = User.objects.get(username=username)
            print(type(new_friend))
            if operation == 'add':
                Friend.make_friend(request.user, new_friend)
            if operation == 'remove':
                Friend.lose_friend(request.user, new_friend)
    except:
        pass
    return redirect('home')


def create_lobby(request):
    return render(request, 'tetris_app/lobby-view.html', {'friends': get_friends_if_exists(request)})
