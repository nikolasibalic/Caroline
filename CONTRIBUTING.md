# Contributing to Caroline

Contributions to Caroline are very welcome! Before starting with
coding, we recommend to open an issue to discuss functionality.
This should be helpful both for development (ensuring that
there is no another parallel effort going on, and that existing
code base functions are utilized) and later make merges with
the main code easier.

In any case, don't hesitate to open issue to ask questions and discuss ideas and suggestions.

## Local development

Backend and FE in container (Linux with Podman installed)

```bash
source build_containers.sh
source deploy.sh
```

Running development server of front end (requires `npm`)

```bash
cd caroline/html
npm install
npx parcel index.html
```
