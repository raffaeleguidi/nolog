# nolog

A simple graylog CLI query tool

~~~~
nolog (c) 2019 RpG (-h or --help for help)
   --user myuser
   --password mypass
   --url http://graylog.my.domain/api
   --query "this AND that"
   --filter stream:xxxxxxxxxxxxxx
   --refresh 5
   --fields timestamp,CONTAINER_NAME,message>
   --help/-h - shows this message
~~~~
