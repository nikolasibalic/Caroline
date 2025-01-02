#! /bin/bash

echo "Build proxy image"
podman build -f Dockerfile_proxy -t roundtable_proxy

echo "Build application server"
podman build -f caroline/server/Dockerfile -t roundtable_application