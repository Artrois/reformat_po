# Reformat PO
This project is created for custom PO file reformatting.
It expects:
```
#   
msgid   "test"
msgstr   "группы"
msgid   "loginname"
msgstr   "Имя_пользователя"
msgid   "writer"
msgstr   "информации"
```

out put will be:
```
msgid            msgstr_debug          msgstr_user 
# 
"gruppe" "gruppe" "группы"
"loginname" "loginname" "Имя_пользователя"
"writer" "writer" "информации"
```

It considers koi8-r encoding.

## Usage
```
node translate_PO_YML.js [source.po] [target.po]
```
See example:
```
node ./reformat_PO.js ./anzeigetexte.user.muster.po ./ersetze_anzeigetexte_user.po
```
