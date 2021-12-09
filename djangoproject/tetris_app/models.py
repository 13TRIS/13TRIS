from django.db import models


# python manage.py migrate
# Create your models here.

class User(models.Model):
    STATUS = (
        ('Online', 'Online'),
        ('Playing', 'Playing'),
        ('Offline', 'Offline'),
    )
    name = models.CharField(max_length=10, null=True)
    password = models.CharField(max_length=50, null=True)
    profilePicture = models.CharField(max_length=200, null=True)
    ranking = models.IntegerField(null=True)
    # friends = list
    status = models.CharField(max_length=10, null=True, choices=STATUS)
    dateCreated = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.name

    def addFriend(self):
        return

    def viewFriends(self):
        return

    def deleteFriend(self):
        return


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
    # matches = list
    def getMatch(self):
        return

    def queryMatch(self):
        return

    def saveMatch(self):
        return

    def deleteMatch(self):
        return


class MatchManagement(models.Model):
    # matches = list
    def searchPlayers(self):
        return

    def startMatch(self):
        return

    def endMatch(self):
        return
