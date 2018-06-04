FROM ubuntu:18.04 as builder

# Setup APT
RUN echo 'APT::Install-Recommends "0";' > /etc/apt/apt.conf.d/dx-no-recommends
RUN apt-get update && apt-get -y upgrade

# Remove init system
RUN apt-get purge -y --allow-remove-essential init systemd

# Curl
RUN apt-get install -y ca-certificates curl

# Build-time utils
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y apt-transport-https gdebi-core gnupg localepurge

# Node
RUN curl -L https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN npm i -g npm@5
RUN npm cache clean --force
RUN npm set progress=false
RUN npm set loglevel=error
RUN npm set unsafe-perm=true
RUN npm set fetch-retries 5

# .NET Core
RUN curl -L https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg
RUN echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-bionic-prod bionic main" > /etc/apt/sources.list.d/dotnetdev.list
RUN apt-get update
RUN DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1 apt-get install -y dotnet-sdk-2.1.200
RUN rm /usr/share/dotnet/sdk/*/nuGetPackagesArchive.lzma

# Slim
RUN rm -r /usr/share/dotnet/sdk/*/FSharp
RUN rm -r /usr/share/dotnet/store/*
RUN find /usr/share/dotnet -type f -name '*.resources.dll' -delete
RUN find /usr/share/dotnet -type f -wholename '**/runtimes/win*/**' -delete

# Chrome, see https://stackoverflow.com/a/36906724
RUN curl -L https://www.slimjet.com/chrome/lnx/chrome64_66.0.3359.181.deb > chrome.deb
RUN gdebi -n ./chrome.deb
RUN unlink ./chrome.deb
RUN rm -rf /opt/google/chrome/swiftshader
RUN find /opt/google/chrome/locales -type f ! -name 'en-US.pak' -delete

# Utils for docker-ci.sh
RUN apt-get install -y dbus-x11 httping x11vnc xvfb

# Utils for drone-cache.sh
RUN apt-get install liblz4-tool

# Yes :)
RUN apt-get install -y mc

# Use UTF-8
RUN apt-get install -y locales
RUN locale-gen en_US.UTF-8
RUN printf "MANDELETE\nen_US.UTF-8" > /etc/locale.nopurge
RUN localepurge

# Ensure UTC
RUN [ "$(date +%Z)" = "UTC" ] || exit 1

# Fix fonts
# https://bugs.launchpad.net/bugs/1769654
# https://steemit.com/linux/@arrowj/fixing-font-rendering-issues-in-ubuntu-bionic-beaver-lts
RUN curl -L http://archive.ubuntu.com/ubuntu/pool/main/f/fonts-liberation/fonts-liberation_1.07.4-1_all.deb > liberation.deb
RUN curl -L http://archive.ubuntu.com/ubuntu/pool/main/f/freetype/libfreetype6_2.8-0.2ubuntu2.1_amd64.deb > freetype.deb
RUN dpkg -i freetype.deb liberation.deb
RUN rm freetype.deb liberation.deb

# Remove build-time utils
RUN apt-get purge -y apt-transport-https gdebi-core gnupg localepurge

# Clean APT
RUN apt-get autoremove -y --purge
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /etc/apt/sources.list.d/*

#############################################################

FROM scratch

COPY --from=builder / /

ENV LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    TERM=xterm \
    DISPLAY=:99 \
    NUGET_XMLDOC_MODE=skip \
    DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1 \
    DOTNET_CLI_TELEMETRY_OPTOUT=1

WORKDIR /devextreme
STOPSIGNAL SIGKILL
