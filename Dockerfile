FROM ruby:3.2.2-slim

LABEL maintainer Travis CI GmbH <support+travis-web-docker-images@travis-ci.com>

RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

ENV NPM_CONFIG_LOGLEVEL info

RUN apt-get update && \
    apt-get -y install gnupg2 curl git make g++ libpq-dev && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash -s && \
    apt-get install -y --no-install-recommends \
        nodejs yarn \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

RUN mkdir -p /app
WORKDIR /app

COPY Gemfile      /app
COPY Gemfile.lock /app
COPY waiter       /app/waiter

RUN bundle install --without assets development test

COPY package.json /app
COPY package-lock.json /app

RUN npm install --silent -g ember-cli

COPY . /app

RUN npm ci --silent
RUN ember build --environment=production

RUN cp -a public/* dist/

CMD bundle exec puma -I lib -p ${PORT:-4000} -t ${PUMA_MIN_THREADS:-8}:${PUMA_MAX_THREADS:-12} -w ${PUMA_WORKERS:-2} --preload waiter/config.ru
