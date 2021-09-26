#!/bin/bash

deploy=false

while [ -n "$1" ]; do # while loop starts

    case "$1" in

    -deploy) deploy=true ;;

    --)
        shift # The double dash makes them parameters

        break
        ;;

    *) echo "Option $1 not recognized" ;;

    esac

    shift

done

outputFolder="../html_dist/"

echo "Optimising size of CSS"
#npx postcss ./style/style_bright.css > "$outputFolder"/style/style_bright.css
#npx postcss ./style/roundtable_style.css > "$outputFolder"/style/roundtable_style.css
#npx postcss ./style/code_style.css > "$outputFolder"/style/code_style.css

cat ./style/normalize.css ./style/style_bright.css ./style/roundtable_style.css ./style/code_style.css | npx postcss > "$outputFolder"/style/style.css

echo "Optimising size of js from my app"

java -jar ../../../researchx3d/project_files/closure_compiler/compiler.jar  \
--compilation_level ADVANCED_OPTIMIZATIONS  \
  --angular_pass\
  --js ./js/roundtable.js\
  --js ./js/caroline.js\
  --js ./js/export_functions.js\
  --externs ./js/externs.js\
	--js_output_file "$outputFolder"/js/roundtable_app.js


  echo "Optimising size of html"
  cp index.html "$outputFolder"/index.html
  sed -i 's|<script src="./js/roundtable.js"></script>|<script src="./js/roundtable_app.js"></script>|g' "$outputFolder"/index.html
  sed -i 's|<script src="./js/caroline.js"></script>||g' "$outputFolder"/index.html
  sed -i 's|<link rel="stylesheet" type="text/css" href="./style/style_bright.css">||g' "$outputFolder"/index.html
  sed -i 's|<link rel="stylesheet" type="text/css" href="./style/code_style.css">||g' "$outputFolder"/index.html
  sed -i 's|<link rel="stylesheet" type="text/css" href="./style/roundtable_style.css">|<link rel="stylesheet" type="text/css" href="./style/style.css">|g' "$outputFolder"/index.html


  html-minifier --collapse-whitespace --remove-comments --remove-optional-tags \
  	--remove-redundant-attributes --remove-script-type-attributes \
  	 --use-short-doctype --minify-css true\
  	"$outputFolder"/index.html  --output "$outputFolder"/index.html


echo "compressing .png images"

find ./images -maxdepth 1 -iname "*.png" -exec pngquant --force \
	--quality=40-100  --strip \{} --output "$outputFolder"/\{} \;

echo "creating gziped version of files"
find "$outputFolder" -maxdepth 6 -iname "*.js" -exec gzip -f -k {} > {}.gz \;
find "$outputFolder" -maxdepth 6 -iname "*.css" -exec gzip -f -k {} > {}.gz \;
find "$outputFolder" -maxdepth 6 -iname "*.html" -exec gzip -f -k {} > {}.gz \;

if [ "$deploy" = true ]; then
  echo "deploying copy to server"
  rsync -avze "ssh -i ~/Documents/Desktop/Pet_Projects/researchx3d/deployment/rx3d-ec2-front-server.pem" \
    -r "$outputFolder"/* ec2-user@www.researchx3d.com:~/transfer_roundtable/.

  echo "setting server to serve this"

  echo "ADD YOUR OWN FINAL DEPLOYMENT SCRIPT"

else
  echo "Changes are NOT deployed to server"
  echo "add -deploy option if you want to deploy changes to server."
fi
