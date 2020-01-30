find dotnet_packages -type f -name '*.nupkg' -delete
find dotnet_packages -type f -name '*.xml'   -delete
find dotnet_packages -type f -name '*.pdb'   -delete
find dotnet_packages -type f -wholename '**/lib/net[2-4]*/**'      -delete
find dotnet_packages -type f -wholename '**/lib/portable-net*/**'  -delete
