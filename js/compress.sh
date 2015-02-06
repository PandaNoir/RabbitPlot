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

java -jar ~/Desktop/trash/compiler-latest/compiler.jar mainCtrl.js calendarCtrl.js eventEditorCtrl.js groupEditorCtrl.js detailCtrl.js settingCtrl.js eventListCtrl.js factory.js eventCal.js --js_output_file main.js
#--warning_level VERBOSE

#java -jar ~/Desktop/trash/compiler-latest/compiler.jar calendar.js detail.js eventCal.js eventEditor.js eventList.js factory.js groupEditor.js mainController.js setting.js --js_output_file main.js
gzip -c9 main.js>main.js.gz
