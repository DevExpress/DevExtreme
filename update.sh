#!/bin/bash
git pull
git fetch upstream
git merge 24_2
git merge grids/cardview/main
git merge grids/cardview/reactive
git merge grids/cardview/di
