#!/bin/bash
git checkout gh-pages

grunt dist

git add -f js/main_bundle.js
git add -f css/main.css

git commit -m 'Automatic Travis Build'

git push --force --quiet origin gh-pages:gh-pages
