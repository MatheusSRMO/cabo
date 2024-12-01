# Use a imagem base do Ubuntu mais recente com suporte de longo prazo
FROM ubuntu:22.04

# Set environment variables
ENV PYTHON_VERSION 3.10
ENV PYTHON_PIP_VERSION 23.2
ENV NODE_VERSION 20
ENV DEBIAN_FRONTEND noninteractive

# Atualizar e instalar dependências
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    mono-mcs \
    golang-go \
    default-jre \
    default-jdk \
    python3-pip \
    python3.10 \
    curl && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Verificar que Node.js e Python estão instalados corretamente
RUN node -v && npm -v && python3 --version && pip3 --version

# Criar um usuário não-root com UID fixo
RUN useradd -m -u 10001 appuser
USER appuser

# Configurar o diretório de trabalho e copiar os arquivos da aplicação
WORKDIR /app
COPY --chown=appuser:appuser . /app

# Instalar dependências da aplicação
RUN npm install

# Expor a porta da aplicação
EXPOSE 3001

# Mostrar a versão da aplicação ao iniciar
RUN echo "$(date +%Y-%m-%d_%H-%M-%S)" > app_version.txt

# Comando para iniciar a aplicação
CMD ["sh", "-c", "echo 'Aplicação versão:' $(cat app_version.txt) && npm run dev"]
