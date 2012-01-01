Browser Shim

More easily get other stuff integerated with the browser (IE _and_ FF).
Like, IM, p2p, file-systems (nfs, LAFs,...), and general apps. See  what's available at http://someplace.for.shims.

This IE-Extension/FF-Add-On manages integration in a consistent, fairly secure, and cross-browser way using js/java(vm)/html.

cf. Mapping a protocol to a web-app on a server (html5): https://developer.mozilla.org/en/Web-based_protocol_handlers
cf. Discovery using the above: http://blog.mozilla.com/webdev/2010/07/26/registerprotocolhandler-enhancing-the-federated-web/

Quick Start

Go to http://someplace.for.shims and get a shim.

OR
Install this like anyother addon
    firefox: https://...
    IE: https:///
And,
Adapt a "page" with....


About

Does your app/technology work perfectly fine with http:? Then you don't need this extension/add-on.

Do you need to do some mapping of http operations to your app/techology? That's what this does, cross-browser.

Can you almost do what you want in js/html, but not quite? This might be the "just enough" to let you.

Do you need more than just "host" for same-origin-policy? That's one of the primary motivations of this! See the "Same Origin Policy" section for a simple recipe.

Do you want to write an extension/add-on that works cross-browser? If it makes sense to act like a web-app (pages/urls/etc.), then this might be a good way to do it.

Can you write extensions for chrome, safari, or some other browser? Consider "porting" the minimal core of Shim to it so cross-platform is more platforms. See http://someplace.for.shims/other-browsers (or githup://xxxx).

Do you want to use ruby/python/etc.? See if there is a "J" version that runs on the java-virtual-machine (e.g. jpython, jruby, cobol(!), scheme). For example: http://en.wikipedia.org/wiki/List_of_JVM_languages

Do you have a JS/HTML app that you'd like to turn into a general app without a server? There's a feature that can turn a web "page" into an extension/add-on in a fairly secure way (see "Generify a Web App").
 
For example, one of the interesting "stuff" is isolating various web-apps that run on your local machine (cf. couchapp.org) . While you can simply use "http://localhost/whatever", there is a security issue: different local apps can "spy" and "do evil" to each other. If different local apps were treated like they were on different servers, then standard security mechanisms would apply (see "Same Origin Policy").

Tools like Tor or bittorrent could use this extension/add-on.

One of the motivations for this extension/add-on was to allow the use of p2p protocols for web-apps.

Examples

Take an existing implementation of Jabber/XMPP (or google-talk IM) in javascript/html (http://www.google.com/search?q=jabber+javascrip) and turn it into a regular IM client that is _not_ limited to talking to the one host. You no longer need your own server.

Run a web-app from a distributed file-system (like https://tahoe-lafs.org/), or NoSQL db (like couch, or cassandra). Isolate different "apps" with same-origin-policy mapping. Almost P2P web-apps.

Turn a real P2P system into a real P2P web-app system.


See README.txt (this file), for intro and "About".
See simple-diy.txt for some simple ways of creating a custom shim. E.g. adapting a "page" to be generic, "mapping" a localhost service, etc.
See technical.txt for a description of the technical details.
See integrating-stuff.txt for integrating using this extension/add-on, including recipes, etc.
See https://github.com/awgrover/browser-protocol-shim/wiki/design for the design doc of this extension/add-on.

