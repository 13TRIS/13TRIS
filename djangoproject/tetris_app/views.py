from django.shortcuts import render


# Create your views here.
def login_view(request):
    return render(request, 'tetris_app/login-view.html')


def register_view(request):
    return render(request, 'tetris_app/register-view.html')
