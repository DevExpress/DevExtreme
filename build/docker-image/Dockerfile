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
RUN curl -L https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
RUN npm i -g npm@6
RUN npm cache clean --force
RUN npm set progress=false
RUN npm set loglevel=error
RUN npm set unsafe-perm=true
RUN npm set fetch-retries 5
RUN npm set audit false

# .NET Core
RUN curl -L https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg
RUN echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-bionic-prod bionic main" > /etc/apt/sources.list.d/dotnetdev.list
RUN apt-get update
RUN DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1 apt-get install -y dotnet-sdk-2.1
RUN rm /usr/share/dotnet/sdk/*/nuGetPackagesArchive.lzma

# Slim
RUN rm -r /usr/share/dotnet/sdk/*/FSharp
RUN rm -r /usr/share/dotnet/sdk/NuGetFallbackFolder/*
RUN rm -r /usr/share/dotnet/shared/Microsoft.AspNetCore.*
RUN find /usr/share/dotnet -type f -name '*.resources.dll' -delete
RUN find /usr/share/dotnet -type f -wholename '**/runtimes/win*/**' -delete

# Chrome, see https://stackoverflow.com/a/36906724
RUN curl -L http://www.slimjetbrowser.com/chrome/files/70.0.3538.77/google-chrome-stable_current_amd64.deb > chrome.deb
RUN gdebi -n ./chrome.deb
RUN unlink ./chrome.deb
RUN rm -rf /opt/google/chrome/swiftshader /opt/google/chrome/libwidevinecdm.so
RUN find /opt/google/chrome/locales -type f ! -name 'en-US.pak' -delete

# Firefox
RUN apt-get install -y firefox
RUN mkdir /firefox-profile
RUN for p in \
    '"browser.shell.checkDefaultBrowser", false' \
    '"datareporting.policy.dataSubmissionEnabled", false' \
    '"font.name-list.monospace.x-western", "Liberation Mono"' \
    '"font.name-list.sans-serif.x-western", "Liberation Sans"' \
    '"font.name-list.serif.x-western", "Liberation Serif"' ; do echo "user_pref($p);" >> /firefox-profile/prefs.js; done

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

# Remove build-time utils
RUN apt-get purge -y apt-transport-https gdebi-core gnupg localepurge

# Clean APT
RUN apt-get autoremove -y --purge
RUN apt-get clean
RUN rm -rf /etc/apt/sources.list.d/* /tmp/* /usr/share/doc/* /var/cache/* /var/lib/apt/lists/* /var/log/* 

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
