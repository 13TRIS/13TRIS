# Generated by Django 3.2.8 on 2022-04-07 08:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mode', models.CharField(choices=[('Solo', 'Singleplayer'), ('Online', 'Player versus Player'), ('AI', 'Player versus AI')], max_length=20, null=True)),
                ('date', models.DateTimeField(auto_now_add=True, null=True)),
                ('status', models.CharField(choices=[('Solo', 'Singleplayer'), ('Online', 'Player versus Player'), ('AI', 'Player versus AI')], max_length=20, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='MatchManagement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profilePicture', models.CharField(max_length=200, null=True)),
                ('ranking', models.IntegerField(null=True)),
                ('status', models.CharField(choices=[('Online', 'Online'), ('Playing', 'Playing'), ('Offline', 'Offline')], max_length=10, null=True)),
                ('dateCreated', models.DateTimeField(auto_now_add=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='Profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Friend',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('current_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL)),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
