# FROM python:3.13-slim-bookworm

# RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && apt-get clean

# ADD https://astral.sh/uv/install.sh /uv-installer.sh
# RUN sh /uv-installer.sh && rm /uv-installer.sh
# ENV PATH="/root/.local/bin/:$PATH"

# WORKDIR /app
# COPY . .

# RUN uv sync --locked
# EXPOSE 8000

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM python:3.13-slim-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates
ADD https://astral.sh/uv/install.sh /uv-installer.sh
RUN sh /uv-installer.sh && rm /uv-installer.sh
ENV PATH="/root/.local/bin/:$PATH"

WORKDIR /app
COPY . .

RUN uv sync --locked
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000
ENTRYPOINT ["fastapi", "run", "main.py", "--port", "8000"]
