from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


# python manage.py migrate
# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='Profile')
    STATUS = (
        ('Online', 'Online'),
        ('Playing', 'Playing'),
        ('Offline', 'Offline'),
    )
    profilePicture = models.ImageField(default='img/user_icon_128px.png', upload_to='profile_pictures', blank=True)
    ranking = models.IntegerField(null=True)
    status = models.CharField(max_length=10, null=True, choices=STATUS)
    dateCreated = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.user.username

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.update_or_create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.Profile.save()

    @classmethod
    def get_profile_by_name(cls, username_input):
        return cls.objects.filter(username=username_input).first()


class Friend(models.Model):
    users = models.ManyToManyField(User)
    current_user = models.ForeignKey(User, related_name='owner', null=True, on_delete=models.CASCADE)

    @classmethod
    def make_friend(cls, current_user, new_friend):
        friend, created = cls.objects.get_or_create(current_user=current_user)
        friend.users.add(new_friend)
        print(f'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx {str(friend.users.count())}')

    @classmethod
    def lose_friend(cls, current_user, new_friend):
        friend, created = cls.objects.get_or_create(current_user=current_user)
        friend.users.remove(new_friend)
        print(f'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy {str(friend.users.count())}')

    def __str__(self):
        return self.current_user.username


class Match(models.Model):
    MODE = (
        ('Solo', 'Singleplayer'),
        ('Online', 'Player versus Player'),
        ('AI', 'Player versus AI'),
    )
    STATUS = (
        ('Ongoing', 'Ongoing'),
        ('Finished', 'Finished'),
    )
    # user list
    mode = models.CharField(max_length=20, null=True, choices=MODE)
    date = models.DateTimeField(auto_now_add=True, null=True)
    status = models.CharField(max_length=20, null=True, choices=MODE)


class History(models.Model):
    MODE = (
        ('Classic', 'Classic'),
        ('13tris', '13tris')
    )
    OPPONENT = (
        ('Solo', 'Solo'),
        ('Multiplayer', 'Multiplayer'),
        ('AI', 'AI')
    )
    # matches = list
    score = models.IntegerField(default=-1)
    mode = models.CharField(max_length=20, null=False, choices=MODE, default=MODE[0][0])
    opponent = models.CharField(max_length=20, null=False, choices=OPPONENT, default=OPPONENT[0][0])
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    date_of_score = models.DateTimeField(auto_now=True)


class MatchManagement(models.Model):
    # matches = list
    def searchPlayers(self):
        return

    def startMatch(self):
        return

    def endMatch(self):
        return
