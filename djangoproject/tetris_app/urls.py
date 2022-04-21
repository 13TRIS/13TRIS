from django.urls import path
from . import views
from django.views.generic import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='/login')),  # for going to the login view even if no url path is specified
    path('login', views.login_view, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('register', views.register_view),
    path('home', views.homepage_view, name='home'),
    path('impressum', views.impressum_view),
    path('faq', views.faq_view),
    path('datenschutz',views.datenschutz_view),
    path('game-solo', views.game_solo_view),
    path('validate_username', views.validate_username, name='validate_username'),
    path('connect/<str:operation>/<str:username>', views.update_friend, name='update_friend'),
    path('history/add', views.set_leaderboard, name='set_leaderboard'),
    path('history/get', views.get_leaderboard, name='get_leaderboard')
]
