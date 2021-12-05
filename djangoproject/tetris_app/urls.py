from django.urls import path
from .views import login_view, register_view, homepage_view, impressum_view, FAQ_view
from django.views.generic import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='/login')),  # for going to the login view even if no url path is specified
    path('login', login_view),
    path('register', register_view),
    path('home', homepage_view),
    path('impressum', impressum_view),
    path('faq', FAQ_view)
]
