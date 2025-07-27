#!/usr/bin/env bash

pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python initial_data_loader.py