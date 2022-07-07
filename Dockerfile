FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt
RUN apt-get update && apt-get install iputils-ping -y

COPY . .
