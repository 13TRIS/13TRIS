from django.shortcuts import render


# Create your views here.
def login_view(request):
    return render(request, 'tetris_app/login-view.html')


def register_view(request):
    return render(request, 'tetris_app/register-view.html')


# This has to be removed eventually
def homepage_view(request):
    return render(request, 'tetris_app/homepage-view.html')
