FROM ubuntu:20.04

ENV HOME /home
WORKDIR $HOME/
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y \
    git \
    vim

# Install Ruby, SQLite3
RUN apt-get install -y \
    ruby-full \
    sqlite3 \
    libsqlite3-dev

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs npm

# Install Yarn
RUN npm install --global yarn

# install Rails
RUN gem install rails
