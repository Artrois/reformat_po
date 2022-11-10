# Reformat PO
This project is created for custom PO file reformatting.
It expects a PO file of koi8-r encoding:
```
#   
msgid   "test"
msgstr   "группы"
msgid   "loginname"
msgstr   "Имя_пользователя"
msgid   "writer"
msgstr   "информации"
```

out put will be in UTF-8:
```
msgid            msgstr_debug          msgstr_user 
# 
"gruppe" "gruppe" "группы"
"loginname" "loginname" "Имя_пользователя"
"writer" "writer" "информации"
```



## Usage
```
node translate_PO_YML.js [source.po] [target.po]
```
See example:
```
node ./reformat_PO.js ./anzeigetexte.user.muster.po ./ersetze_anzeigetexte_user.po
```
As the target file will be finally in utf-8 you may consider to use iconv to convert the target file to koi8-r:
```
iconv -f utf-8 -t koi8-r file1.txt > file2.txt
```
