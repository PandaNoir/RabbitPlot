#!/bin/sh
#
#if test $# -ne 0; then
#    java -jar ~/Desktop/trash/compiler-latest/compiler.jar --js_output_file closure $1 --js_output_file min/$1
#    echo 'compressed '$1
#    gzip -c9 min/$1>min/$1.gz
#else
#    java -jar ~/Desktop/trash/compiler-latest/compiler.jar calendar.js --js_output_file min/calendar.js
#    echo 'compressed calendar.js'
#    gzip -c9 min/calendar.js>min/calendar.js.gz
#
#fi

java -jar ~/Desktop/trash/compiler-latest/compiler.jar mainController.js calendar.js eventCal.js eventEditor.js groupEditor.js detail.js setting.js eventList.js factory.js --js_output_file main.js

#java -jar ~/Desktop/trash/compiler-latest/compiler.jar calendar.js detail.js eventCal.js eventEditor.js eventList.js factory.js groupEditor.js mainController.js setting.js --js_output_file main.js
gzip -c9 main.js>main.js.gz
