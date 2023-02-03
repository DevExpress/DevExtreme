FROM alpine:edge

ENV ALPINE_REPOS="\
 --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing/\
 --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/\
 --repository http://dl-cdn.alpinelinux.org/alpine/edge/main/\
 --repository http://dl-cdn.alpinelinux.org/alpine/v3.11/community/\
 --repository http://dl-cdn.alpinelinux.org/alpine/v3.11/main/\
"


RUN apk --no-cache $ALPINE_REPOS upgrade && \
 apk --no-cache $ALPINE_REPOS add \
 libevent nodejs npm chromium firefox xwininfo xvfb dbus eudev ttf-freefont fluxbox procps tzdata

RUN mkdir /devextreme \
    && adduser -D user

USER user
EXPOSE 1437 1438
WORKDIR /devextreme
STOPSIGNAL SIGKILL
