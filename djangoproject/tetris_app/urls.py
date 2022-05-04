from django.urls import path
from . import views
from django.views.generic import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='/login')),  # for going to the login view even if no url path is specified
    path('login', views.login_view, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('register', views.register_view, name='register'),
    path('user/<str:user>', views.user_profile, name='user'),
    path('home', views.homepage_view, name='home'),
    path('impressum', views.impressum_view, name='impressum'),
    path('faq', views.faq_view, name='faq'),
    path('datenschutz', views.datenschutz_view, name='datenschutz'),
    path('game-solo', views.game_solo_view, name='game-solo'),
    path('validate_username', views.validate_username, name='validate_username'),
    path('connect/<str:operation>/<str:username>', views.update_friend, name='update_friend'),
    path('history/add', views.set_leaderboard, name='set_leaderboard'),
    path('history/get', views.get_leaderboard, name='get_leaderboard'),
    path('create-lobby', views.create_lobby, name='create_lobby'),
]
