FROM ubuntu:16.04

ENV LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    TERM=xterm \
    DISPLAY=:99

WORKDIR /devextreme
STOPSIGNAL SIGKILL

RUN apt-get update \
    && apt-get install -y apt-transport-https curl gdebi git httping mc openssl python software-properties-common unzip wget x11vnc xvfb locales tzdata \
    && locale-gen en_US.UTF-8

RUN ln -fs /usr/share/zoneinfo/UTC /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get install -y nodejs \
    && npm set progress=false \
    && npm set loglevel=error \
    && npm set depth=0 \
    && npm set unsafe-perm=true

RUN sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ xenial main" > /etc/apt/sources.list.d/dotnetdev.list' \
    && apt-key adv --keyserver apt-mo.trafficmanager.net --recv-keys 417A0893 \
    && apt-get update \
    && apt-get install -y dotnet-sdk-2.0.0

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -O chrome.deb \
    && gdebi -n ./chrome.deb \
    && unlink ./chrome.deb
