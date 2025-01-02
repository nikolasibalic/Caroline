#! /bin/bash

echo "Create pod roundtable"
podman pod create -p 127.0.0.1:8001:80 --replace roundtable

podman run -d --pod roundtable --replace --memory=2GB --cpus=2 \
    --name roundtable_proxy_instance1 \
    localhost/roundtable_proxy:latest

podman run -d --pod roundtable --replace --memory=2GB --cpus=2 \
    --name roundtable_application_instance1 \
    -e SECRET_KEY="YOUR_RANDOM_STIRNG*" \
    -e SUBSCRIBER_KEY="YOUR_SUBSCRIBER_TOKEN_RANDOM_STRING" \
    -e GOOGLE_RECAPTCHA_SECRET="FORM_GOOGLE" \
    -e SERVER_DOMAIN_NAME="DOMAIN_NAME" \
    localhost/roundtable_application:latest
