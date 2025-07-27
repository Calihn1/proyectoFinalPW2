#!/usr/bin/env bash

python manage.py makemigrations
python manage.py migrate
python initial_data_loader.py
