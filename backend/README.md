# README

## 教材
- [Rails をはじめよう - Railsガイド](https://railsguides.jp/getting_started.html)

## 環境構築

### ディレクトリを作成

```
$ mkdir api/
```

### Dockerfileを作成
```
$ touch api/Dockerfile
```

Dockerfile:
```Dockerfile
FROM ruby:2.7.1

RUN apt-get update -qq && \
    apt-get install -y build-essential \ 
    libpq-dev \        
    nodejs

RUN mkdir /app
ENV APP_ROOT /app
WORKDIR $APP_ROOT

ADD ./Gemfile $APP_ROOT/Gemfile
ADD ./Gemfile.lock $APP_ROOT/Gemfile.lock

RUN bundle install
```

### Gemfileを作成
```
$ touch api/Gemfile api/Gemfile.lock
```

api/Gemfile
```Gemfile
source 'https://rubygems.org'
gem 'rails', '~> 6.0.3'
```

Gemfile.lockは空でOK

### docker-compose.ymlを作成
```
$ touch docker-compose.yml
```

docker-compose.yml
```yml
version: '3'

services:
  web:
    build: ./api
    command: bundle exec rails s -p 3000 -b '0.0.0.0'
    ports:
      - '3000:3000'
    depends_on:
      - db
    volumes:
      - ./api:/app
      - bundle:/usr/local/bundle
    tty: true
    stdin_open: true
  db:
    image: mysql:5.7
    volumes:
      - mysql_data:/var/lib/mysql/
    environment:
      MYSQL_ROOT_PASSWORD: password
    ports:
      - '3306:3306'

volumes:
  mysql_data:
  bundle:
```

### プロジェクトの作成

Railsプロジェクトを作成
```
$ docker-compose run web rails new . --force --database=mysql
```

bundle install
```
$ docker-compose run web bundle install
```

Gemfileが更新されたので、Dockerイメージを更新
```
$ docker-compose build
```

DBの設定ファイルを修正

api/config/database.yml
```yaml
default: &default
  adapter: mysql2
  encoding: utf8mb4
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: root
- password:
+ password: password
- host: localhost
+ host: db
```

DBの作成
```
$ docker-compose run web rails db:create 
```

### 環境の立ち上げ
```
$ docker-compose up
```

---
### 時間があるときにちゃんと反映する雑記

エラーが出た
```
web_1  | /usr/local/bundle/gems/webpacker-4.3.0/lib/webpacker/configuration.rb:95:in `rescue in load': Webpacker configuration file not found /app/config/webpacker.yml. Please run rails webpacker:install Error: No such file or directory @ rb_sysopen - /app/config/webpacker.yml (RuntimeError)
```

Node.jsのバージョンが古かったのでLST版をインストール
```
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt-get install -y nodejs
```

最新のyarnをインストール（apt installだと古いバージョンのが入ってしまうため）
```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
apt-get update && apt-get install yarn
```

エラー出た
```
undefined method `javascript_pack_tag’
```

Rails再起動したら直った

<!-- Gemfileからwebpackerを削除して対処

api/Gemfile
```Gemfile
# gem 'webpacker', '~> 4.0'
``` -->

### 参考記事
- [DockerでRails + Vue + MySQLの環境構築をする方法【2020/09最新版】 - Qiita](https://qiita.com/Kyou13/items/be9cdc10c54d39cded15)
- [nodesource/distributions: NodeSource Node.js Binary Distributions](https://github.com/nodesource/distributions#installation-instructions)
- [【Rails】ArgumentError: Malformed version number string 0.32+gitでwebpacker:installが実行できない場合の対処方法 - Qiita](https://qiita.com/TomoProg/items/9497be086d338b3b74cc)
- [Rails4へのVue.js 導入におけるつまづきを解決する方法 | アルゴリズムのHelloWorld](https://hi-algorithm.com/rails4-vue-js-error/)