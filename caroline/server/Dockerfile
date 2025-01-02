FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim AS build-env

ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev
# ADD caroline_relay_server.py /app
# ENV PATH="/app/.venv/bin:$PATH"
# CMD ["gunicorn", "-k", "gevent", "-w", "1", "caroline_relay_server:app", "--bind", "0.0.0.0:8000"]

FROM python:3.11-slim-bookworm
COPY --from=build-env /app /app
ENV PATH="/app/.venv/bin:$PATH"
WORKDIR /app
ADD caroline_relay_server.py /app
CMD ["gunicorn", "-k", "gevent", "-w", "1", "caroline_relay_server:app", "--bind", "0.0.0.0:8000"]