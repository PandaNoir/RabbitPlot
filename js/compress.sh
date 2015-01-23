#!/bin/sh
if test $# -ne 0; then
    java -jar ~/Desktop/trash/compiler-latest/compiler.jar --js_output_file closure $1 --js_output_file min/$1
    echo 'compressed '$1
    gzip -c9 min/$1>min/$1.gz
else
    java -jar ~/Desktop/trash/compiler-latest/compiler.jar calendar.js --js_output_file min/calendar.js
    echo 'compressed calendar.js'
    java -jar ~/Desktop/trash/compiler-latest/compiler.jar detail.js --js_output_file min/detail.js
    echo 'compressed detail.js'
    java -jar ~/Desktop/trash/compiler-latest/compiler.jar eventCal.js --js_output_file min/eventCal.js
    echo 'compressed eventCal.js'
    java -jar ~/Desktop/trash/compiler-latest/compiler.jar eventEditor.js --js_output_file min/eventEditor.js
    echo 'compressed eventEditor.js'
    java -jar ~/Desktop/trash/compiler-latest/compiler.jar eventList.js --js_output_file min/eventList.js
    echo 'compressed eventList.js'
    java -jar ~/Desktop/trash/compiler-latest/compiler.jar factory.js --js_output_file min/factory.js
    echo 'compressed factory.js'
    java -jar ~/Desktop/trash/compiler-latest/compiler.jar groupEditor.js --js_output_file min/groupEditor.js
    echo 'compressed groupEditor.js'
    java -jar ~/Desktop/trash/compiler-latest/compiler.jar mainController.js --js_output_file min/mainController.js
    echo 'compressed mainController.js'
    java -jar ~/Desktop/trash/compiler-latest/compiler.jar setting.js --js_output_file min/setting.js
    echo 'compressed setting.js'

    gzip -c9 min/calendar.js>min/calendar.js.gz
    gzip -c9 min/detail.js>min/detail.js.gz
    gzip -c9 min/eventCal.js>min/eventCal.js.gz
    gzip -c9 min/eventEditor.js>min/eventEditor.js.gz
    gzip -c9 min/eventList.js>min/eventList.js.gz
    gzip -c9 min/factory.js>min/factory.js.gz
    gzip -c9 min/groupEditor.js>min/groupEditor.js.gz
    gzip -c9 min/mainController.js>min/mainController.js.gz
    gzip -c9 min/setting.js>min/setting.js.gz

fi
