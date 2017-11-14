FROM ubuntu:16.04 as builder

# Setup APT
RUN echo 'APT::Install-Recommends "0";' > /etc/apt/apt.conf.d/dx-no-recommends
RUN apt-get update && apt-get -y upgrade

# Curl
RUN apt-get install -y ca-certificates curl

# Fonts
RUN apt-get install -y ttf-liberation

# Build-time utils
RUN apt-get install -y apt-transport-https bzip2 gdebi-core gnupg2

# Node
RUN curl -L https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN npm set progress=false
RUN npm set loglevel=error
RUN npm set depth=0
RUN npm set unsafe-perm=true
RUN npm set fetch-retries 5

# .NET Core
RUN curl -L https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg
RUN echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-xenial-prod xenial main" > /etc/apt/sources.list.d/dotnetdev.list
RUN apt-get update
RUN DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1 apt-get install -y dotnet-sdk-2.0.2
RUN rm /usr/share/dotnet/sdk/*/nuGetPackagesArchive.lzma

# Chrome, see https://stackoverflow.com/a/36906724
RUN curl -L https://www.slimjet.com/chrome/lnx/chrome64_61.0.3163.79.deb > chrome.deb
RUN gdebi -n ./chrome.deb
RUN unlink ./chrome.deb

# Firefox 
RUN apt-get install -y libxt6
RUN curl -L https://download-installer.cdn.mozilla.net/pub/firefox/releases/57.0/linux-x86_64/en-US/firefox-57.0.tar.bz2 | tar xfj - -C /opt
RUN /opt/firefox/firefox -headless -CreateProfile default
RUN cd ~/.mozilla/firefox/*.default \
    && echo 'user_pref("font.name-list.sans-serif.x-western",           "Liberation Sans");'    >> prefs.js \
    && echo 'user_pref("font.name-list.serif.x-western",                "Liberation Serif");'   >> prefs.js \
    && echo 'user_pref("browser.shell.checkDefaultBrowser",             false);'                >> prefs.js \
    && echo 'user_pref("datareporting.policy.dataSubmissionEnabled",    false);'                >> prefs.js \
    && echo 'user_pref("layers.acceleration.disabled",                  true);'                 >> prefs.js

# Utils for docker-ci.sh
RUN apt-get install -y dbus-x11 httping x11vnc xvfb

# Utils for drone-cache.sh
RUN apt-get install liblz4-tool

# Yes :)
RUN apt-get install -y mc

# Use UTF-8
RUN apt-get install -y locales
RUN locale-gen en_US.UTF-8

# Ensure UTC
RUN [ "$(date +%Z)" = "UTC" ] || exit 1

# Remove build-time utils
RUN apt-get purge -y apt-transport-https bzip2 gdebi-core gnupg2

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
