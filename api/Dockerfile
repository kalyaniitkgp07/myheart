FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy project files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-cache

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start application
CMD ["uv", "run", "uvicorn", "myheart.main:app", "--host", "0.0.0.0", "--port", "8000"]
