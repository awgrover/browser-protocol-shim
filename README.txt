Ultimately:
More easily get other stuff integerated with the browser (IE _and_ FF).
Like, IM, p2p, file-systems (nfs, LAFs,...), and general apps.

Right Now:
Implements "couchdb:" to treat each couchdb database as a different application.

E.g.
    couchdb://astronomy-app/
is the same as
    http://localhost:5984/astronomy-app/
Except, the browser treats it as a host, so it's protected from cross-site-scripting vs. other "localhost" pages.

Nb: couchdb://_utils/ does not work, because does ajax to "../_all_dbs" (i.e. couchdb://_all_dbs), which is cross-site.
