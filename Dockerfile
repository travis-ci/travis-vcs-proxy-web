FROM nginx:latest

LABEL maintainer Travis CI GmbH <support+travis-web-docker-images@travis-ci.com>

RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

ENV NPM_CONFIG_LOGLEVEL info
ARG API_ENDPOINT

RUN apt-get update && \
    apt-get -y install gnupg2 && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash -s && \
    apt-get install -y --no-install-recommends \
        nodejs yarn \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

COPY . .
RUN npm install --silent -g ember-cli
RUN npm ci --silent
RUN API_ENDPOINT=${API_ENDPOINT} ember build --environment=production
RUN cp docker/nginx.conf /etc/nginx/conf.d/travis.conf

WORKDIR /app
RUN cp -a /build/dist .
RUN rm -rf /build
