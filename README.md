# readme

### Blog : [13tris.dkoeck.de/](http://13tris.dkoeck.de/)

### run server:
```
cd ./frontend/ ; npm run build ; cd ../djangoproject/ ; python manage.py runserver
```

## python virutal enviroment

_this is for linux, idk about windows_

### create virutal enviroment
```
python3 -m venv (path to venv folder)

python3 -m venv ~/django_venv
```

### activate virutal enviroment
```
source (path to venv folder)/bin/activate

source ~/django_venv/bin/activate
```

### create a new requirements.txt file
```
python -m pip freeze > requirements.txt
```

### install the python modules (while inside the venv)
```
python -m pip install -r requirements.txt
```

### deactivate venv
```
deactivate
```

### Mock smtp server
(remove the settings from setting.py `EMAIL_HOST = 'localhost'` and `EMAIL_PORT = 1025` for production if we use that)
```
python -m smtpd -n -c DebuggingServer localhost:1025
```
