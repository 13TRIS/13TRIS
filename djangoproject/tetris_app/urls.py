from django.urls import path
from .views import login_view, logout_user, register_view, homepage_view, impressum_view, faq_view, datenschutz_view, game_solo_view
from django.views.generic import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='/login')),  # for going to the login view even if no url path is specified
    path('login', login_view, name='login'),
    path('logout', logout_user, name='logout'),
    path('register', register_view),
    path('home', homepage_view, name='home'),
    path('impressum', impressum_view),
    path('faq', faq_view),
    path('datenschutz',datenschutz_view),
    path('game-solo', game_solo_view)
]
