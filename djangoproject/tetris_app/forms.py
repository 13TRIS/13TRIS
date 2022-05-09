from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserChangeForm

from .models import Profile


class EditProfileForm(UserChangeForm):
    password = None

    class Meta:
        model = User
        fields = [
            'email',
            'username'
        ]
        widgets = {
            'email': forms.TextInput(attrs={'class': 'form-control'}),
            'username': forms.TextInput(attrs={'class': 'form-control'}),
        }


class EditProfilePictureForm(UserChangeForm):
    password = None

    class Meta:
        model = Profile
        fields = [
            'profilePicture'
        ]
        exclude = [
            'password'
        ]
        widgets = {
            'profilePicture': forms.ClearableFileInput(attrs={'class': 'form-control'}),
        }
