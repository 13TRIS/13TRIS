| <img width="300px" src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" alt="Docker logo"/> | X   | <img width="300px" src="Logo/Logo_full.png" alt="13tris Logo"/> |
|-----------------------------------------------------------------------------------------------------------------------------------------|-----|-----------------------------------------------------------------|

# How to deploy 13TRIS locally with Docker

---

## Table of Content:

0. [Prerequisites](#Prerequisites)
1. [Install Docker](#Install-Docker)
2. [Docker-Compose](#Docker-Compose)
3. [Git](#Git)
4. [Start the Container](#Start-the-Container)
5. [Stop the Container](#Stop-the-Container)

---

## Prerequisites

This guide is made for usage on docker and specifically on linux machines running on Windows Subsystem for Linux (WSL).
If you do not have a Unix environment on Windows, please make sure that you don't have one beforehand with the following
command:

```shell
wsl -l
```

To install Ubuntu for WSL, run the following command:

```shell
wsl --install -d Ubuntu
```

> To install another distro, try running `wsl --list --online` to see a list of available distros
> and `run wsl --install -d <DistroName>` to install a distro. To uninstall WSL, see
[Uninstall legacy version of WSL](https://docs.microsoft.com/en-us/windows/wsl/troubleshooting#uninstall-legacy-version-of-wsl)
>or [unregister or uninstall a Linux distribution](https://docs.microsoft.com/en-us/windows/wsl/basic-commands#unregister-or-uninstall-a-linux-distribution).

Set the WSL to version 2 ! ... for some reason.
```shell
# check what version your Ubuntu is running on
wsl -l -v
>   NAME      STATE           VERSION
> * Ubuntu    Running         1

wsl --set-version Ubuntu 2
> Conversion in progress, this may take a few minutes...
> For information on key differences with WSL 2 please visit https://aka.ms/wsl2
> WSL 2 requires an update to its kernel component. For information please visit https://aka.ms/wsl2kernel
```
Since Windows is annoying me again, I will follow the guide on how to install a newer kernel for the superior OS:
https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi.

Now run `wsl --set-version Ubuntu 2` again and check if the version is right:
```shell
wsl -l -v
>   NAME      STATE           VERSION
> * Ubuntu    Stopped         2        # nice
```

## Install Docker

> If you do feel like reading official documentation : **https://docs.docker.com/engine/install/ubuntu**

#### Make sure you linux environment is up-to-date

```bash
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release
```

#### Next, add Docker’s repository GPG key:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

#### Add the repository to your sources and update your package lists:

```bash
# Add the public GPG key from Docker to your local sources.list.d
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Make sure to update your repositories
sudo apt-get update
```

### Now you can install Docker:

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Make sure the correct version is installed
docker --version
> Docker version 20.10.16, build aa7e414
```

## Docker Compose

### Install docker-compose as well:

_Make sure that the version of docker-compse is the lastest. Make
sure [here](https://github.com/docker/compose/releases/latest) that tag `v2.6.0` matches the one in the command below._

```bash
# Download
sudo curl -L "https://github.com/docker/compose/releases/download/v2.6.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# make the file an executable
sudo chmod +x /usr/local/bin/docker-compose

# Check if the version is right
docker-compose --version
> Docker Compose version v2.6.0
```

_Alternatively you can use pip:_

```bash
pip install docker-compose
```

#### Check if Docker is running / start Docker

Run this command to see if your system is using `systemd` or `sysvinit`:

```bash
ps -p 1 -o comm=
> systemd OR init

# If the output is systemd
systemctl start docker

# If the command returned init
service docker start

# If you get a permission denied error, run it again with root privileges
sudo !!
```

> If anything is not working, try to understand the _root_ (hehe) of the problem and figure it out yourself... I'm just
> a
> markdown file, sorry. But here are some links that might help:
> - https://stackoverflow.com/a/48957722
> - https://stackoverflow.com/a/61780566
>
> Good luck soldier ! o7

# Git

If you want to use git to download the project, make sure it is installed:

```bash
# Install git
sudo apt-get install git

# Make sure the right version is installed
git --version
> git version 2.25.1

#Clone the 13TRIS repository:
git clone https://github.com/13TRIS/13TRIS.git
```

Alternatively you can use the official [**GitHub CLI**](https://cli.github.com/manual/installation#linux):

```bash
 curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
 echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

 sudo apt update
 sudo apt install gh

 # Clone the repo
 gh repo clone 13TRIS/13TRIS
 ```

Move into the folder:

```bash
cd 13TRIS

# Make sure that you're in the right folder
ls
> brainstorming_board.jpg  djangoproject       docs           README.md         solo.png
> django                   docker-compose.yml  helloworld.py  requirements.txt  sonar-project.properties
> django_env               Dockerfile          out            run.sh            tox.ini

# Or check like this
ls -la | grep Dockerfile
> -rw-rw-r--    1    yourUser yourUser    227  Jun  7 19:56     Dockerfile


# If you're not seeing the right Files
git checkout TETRIS-181
```

# Start the Container

Now that everything is ready, you can start the Docker container by creating a Docker image. The image is like a kitchen
you prepare the use in production with all the tools and architecture that is needed. Once the image is ready, you can
deploy the image in a container and run the project locally:

```bash
# Create the image
docker build -t django-13tris -f Dockerfile .

# If you get a permission denied error, one fix is to allow anyone to read write to this file
sudo chmod 666 /var/run/docker.sock

# Check after the image is build
docker images

> REPOSITORY            TAG          IMAGE ID         CREATED         SIZE
> 13tris_web            latest       bb59dc737a62     39 hours ago    1.05GB
> python                3.9          d0ce03c9330c     6 days ago      915MB


# Now for the fun part :)
# Deploy the container
docker-compose up

[+] Building 12.8s (7/10)
 => [internal] load build definition from Dockerfile                                                               0.0s
 => => transferring dockerfile: 266B                                                                               0.0s
 => [internal] load .dockerignore                                                                                  0.0s
 => => transferring context: 2B                                                                                    0.0s
 => [internal] load metadata for docker.io/library/python:3.9                                                      0.0s
 => [1/6] FROM docker.io/library/python:3.9                                                                        0.2s
 => [internal] load build context                                                                                  0.2s
 => => transferring context: 20.29MB                                                                               0.1s
 => [2/6] WORKDIR /code                                                                                            0.1s
 => [3/6] COPY requirements.txt requirements.txt                                                                   0.0s
 => [4/6] RUN pip3 install -r requirements.txt                                                                    12.3s
 => => # 14db5f7b87f6d89c84f9d62939b719b86f695e
 => => #   Stored in directory: /root/.cache/pip/wheels/d6/9c/58/ee3ba36897e890f3ad81e9b730791a153fce20caa4a8a474df
 => => # Successfully built parse
 => => # Installing collected packages: typing-extensions, pytz, parse, websockets, sqlparse, soupsieve, six, Pillow, m
 => => # ultidict, idna, coverage, chardet, attrs, async-timeout, asgiref, yarl, parse-type, Django, coverage-badge, be
 => => # autifulsoup4, behave, aiohttp, discord.py, behave-django, discord
```

If everything is working according to plan, you should see the following output on the console:

```bash
[+] Running 1/0
 ⠿ Container 13tris_web_1  Recreated                                                                                                 0.1s
Attaching to 13tris-web-1
13tris-web-1  | Watching for file changes with StatReloader
13tris-web-1  | Performing system checks...
13tris-web-1  | 
13tris-web-1  | System check identified no issues (0 silenced).
13tris-web-1  | June 09, 2022 - 08:36:39
13tris-web-1  | Django version 3.2.9, using settings 'djangoproject.settings'
13tris-web-1  | Starting development server at http://0.0.0.0:8000/
13tris-web-1  | Quit the server with CONTROL-C
```

> Now visit the page http://localhost:8000/ with your browser, or connect the container to a docker network of other
> containers and deploy it on your [**server**](https://13tris.mkrabs.duckdns.org/) ! 🎉🎉

# Stop the Container

Why would you ever stop this marvelous container? Oh to reboot your system ? Well if you want to destroy your `uptime`
of 27 minutes, go ahead... Select the terminal in which the container is running and pres the following key combination:

```bash
# Press this
crtl + C

# How it should look when shutting down
^CGracefully stopping... (press Ctrl+C again to force) # Don't :)
[+] Running 3/3
 ⠿ Container 13tris_web_run_c7eff47d9e22  Stopped          0.0s
 ⠿ Container 13tris-web-1                 Stopped         10.4s
 ⠿ Container 13tris_web_run_8840d771d10b  Stopped          0.0s
canceled
```

---

Thank you for installing the 13TRIS trojaner. I hope this relatively small guide on how to run a project in docker on a WSL enviroment. Hope you take this knowledge somewhere with you.
- Team 13TRIS 🤖