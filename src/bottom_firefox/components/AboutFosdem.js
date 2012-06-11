try{
// Do not edit this file, generated from: src/bottom_firefox/components/AboutFosdem.js.tmpl
/*
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.

 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 * Author: Bogomil "Bogo" Shopov <shopov.bogomil@gmail.com>
 * 
 * 
 * Thanks goes to: Mike Kaply && Wladimir Palant for their help and code
 * 
 * */



/*
 * include components and functions we need to create a new protocol
* */

function debug() { for(var i=0; i<arguments.length; i++) {dump(arguments[i]);dump(" ");}; dump("\n") };

const Ci = Components.interfaces;
const Cc = Components.classes;
const Cr = Components.results;
const nsIProtocolHandler = Ci.nsIProtocolHandler;
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

/*
 * function to detect is a value a number or not
 * */
 
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/*
 * function to handle requests.
 * Based on the value after fosdem:
 * */
function  WhereToGo(fres){
	
        return 'http://localhost:5984/'+fres.host+(fres.path ? fres.path : '');

	var cyear = new Date().getFullYear();
	
	if (isNumeric(fres)){
		
	if (fres < cyear & fres > 2002){ 
		return "http://archive.fosdem.org/"+fres;
		}else{
				return "http://fosdem.org/";
			}	
	}else //non-numeric
	{
		
		switch (fres){
			
			case 'about':
			return "http://fosdem.org/about/fosdem";
			break;
			
			case 'schedule':
			return "http://fosdem.org/schedule/tracks";
			break;
			
			case 'venue':
			return "http://fosdem.org/transportation";
			break;
			
			default: return "http://talkweb.eu/openweb/1069";
}
		
	}	
}

function AboutFosdem() {
}

function makeURI(aURL, aOriginCharset, aBaseURI) {
  var ioService = Components.classes["@mozilla.org/network/io-service;1"]
                    .getService(Components.interfaces.nsIIOService);
  debug("Make ",aURL," ~ ",(aBaseURI ? aBaseURI.spec : null));
  return ioService.newURI(aURL, aOriginCharset, aBaseURI);
  }

function tryit(aSpec, aOriginCharset, aBaseURI) {
    var standardURL = Components.classes["@mozilla.org/network/standard-url;1"]
        .createInstance(Components.interfaces.nsIStandardURL);
    standardURL.init( Ci.nsIStandardURL.URLTYPE_STANDARD,-1,"http://ob.org/joe",aOriginCharset, aBaseURI);
    debug("Sample x",standardURL.spec);
    standardURL.init(
        Ci.nsIStandardURL.URLTYPE_STANDARD,
        -1, // default port
        aSpec, 
        aOriginCharset, 
        aBaseURI
        );
    debug("turn "+aSpec+" + "+(aBaseURI ? aBaseURI.spec : null)+" into ",standardURL);
    debug("..host",standardURL.host,"p",standardURL.path);
    debug(":: ",standardURL,standardURL.spec,"s ",standardURL.scheme,'h ',standardURL.host,'p ',standardURL.path);
    debug("->",standardURL.spec);
    return standardURL;
    }

AboutFosdem.prototype = {
  scheme: "couchdb",
  protocolFlags:nsIProtocolHandler.URI_STD | // |  nsIProtocolHandler.URI_NORELATIVE |
                 // nsIProtocolHandler.URI_NOAUTH |
                 nsIProtocolHandler.URI_LOADABLE_BY_ANYONE,

  newURI: function(aSpec, aOriginCharset, aBaseURI)
  {
    // Need to reparse, apparently. aSpec has scheme & path only
    try {
    // interestingly, the first time I see aBaseURI -> this xpi path
    debug("newURI ",aSpec,", ",aBaseURI,(aBaseURI ? aBaseURI.spec : 'null'));
    uri = new OurSchemeURL(aSpec, aOriginCharset, aBaseURI);
    // debug("newURI->",inspect_object(uri));
    debug("newuri->",uri.spec);
    return uri.nsIURI();
    } catch (e) { debug(e) }
  },

  newChannel: function(aURI)
  {
    try {
        debug("break down ",aURI.path);
        var reparsed = new OurSchemeURL(aURI.spec, aURI.originCharset, null);
        uri = {}
        uri.host = reparsed.host;
        uri.path = reparsed.path;
        debug("Reparsed ",uri,'h ',uri.host,'p ',uri.path);
        var ioservice = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
        var wheretogo = WhereToGo(uri);
        var uri = ioservice.newURI(wheretogo, null, null);
        debug("backend uri",uri.spec);
        var backend_channel = ioservice.newChannelFromURI(uri, null).QueryInterface(Ci.nsIHttpChannel);

        var apparent_channel = new ViaHTTPChannel(backend_channel);
        debug("apparent_channel const ",apparent_channel.constructor);
        // debug(".LOAD_BACKGROUND",fakey_prototype.LOAD_BACKGROUND);
        // debug("via.LOAD_BACKGROUND",backend_channel.LOAD_BACKGROUND);
        apparent_channel.via = backend_channel;
        apparent_channel.originalURI = aURI;
        backend_channel.originalURI = aURI;
        apparent_channel.URI = aURI;
            debug("apparent originalURI",apparent_channel.originalURI.spec);
            debug("apparent URI",apparent_channel.URI.spec);
        return apparent_channel;
    } catch (e) { debug(e) }
  },
  classDescription: "Fosdem Basic Protocol Handler",
  contractID: "@mozilla.org/network/protocol;1?name=couchdb", // must match chrome.manifest
  classID: Components.ID('{7270a1fe-7b2f-4dc0-a935-664e9941d3a3}'), // must match chrome.manifest!, descriptive for now
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIProtocolHandler])
}

debug("xOur");
function OurSchemeURL(aSpec, aOriginCharset, aBaseURI) {
    try {
        debug("OurScheme ",aSpec," ~ ",(aBaseURI ? aBaseURI.spec : null));
        debug("base scheme",aBaseURI && aBaseURI.scheme);

        this.__defineGetter__('spec', function() {return this._spec()});
        this.__defineSetter__('spec', function(val) { debug("setter",val); return this.parse_uri(val) });

        this.baseURI = aBaseURI && new OurSchemeURL(aBaseURI.spec, aOriginCharset, null);
        this.spec = aSpec;
        debug("OurScheme ->",this,inspect_object(this)," => ",uri.spec);
    } catch (e) { debug(e,"\n",e.stack) }
    
    };

function inspect_object(o) {
    var rez = "{";
    for (var a in o) {
        var v = o[a];
        if (v != null && v.constructor == Function) { v = "function "+a+"(...)" }
        rez = rez + "\t" + a + " : " + (v && v.toString().split("\n")[0]) + '\n';
        }
    rez = rez + "}";
    return rez;
    };

debug("our proto");
OurSchemeURL.prototype = {
    classDescription: "Parses a general url",
    classID:          Components.ID("{bcf52c33-4676-4fa1-8e8a-f8e88cb80af3}"),
    contractID:       "@etc.etc.com/OurSchemeURL;1",
    QueryInterface: XPCOMUtils.generateQI([Ci.nsIURI]),
    parse_uri : function(spec) {
        debug("parse",spec);
        var scheme_parse = spec.match(/^([\w]+):(.*)/);
        if (scheme_parse) {
            this.scheme = scheme_parse[1];
            spec = scheme_parse[2];
            }
        else {
            this.scheme = this.baseURI && this.baseURI.scheme;
            }
        if (!spec || !spec.match(/^\//)) {
            spec = this.baseURI.path + (spec || '');
            }

        var pieces = spec.match(/^(?:\/\/([^\/]*))?(\/?.+)?/); // approx. right
        this.host = pieces[1] || (this.baseURI && this.baseURI.host) || '';
        this.path = pieces[2] || '';

        pieces = this.host.split(':');
        if (pieces[1]) {
            this.host = pieces[0];
            this.port = pieces[1];
            }
        else {
            this.port = -1;
            }
        },
    _spec : function() {
        var rez = "";
        if (this.scheme && this.scheme != '') {rez += this.scheme + ':' }
        if (this.user && this.user != '') {rez += this.user }
        if (this.password && this.password != '') {rez += ":" + this.password }
        if (this.user && this.user != '' || this.pasword && this.password != '' ) {rez += '@' }
        rez += '//';
        if (this.host && this.host != '') {rez += this.host }
        if (this.port && this.port != -1) {rez += ':' + this.port }
        if (this.path && this.path != '') {rez += this.path }
        return rez;
        },
    nsIURI : function() {
        var uri = Cc["@mozilla.org/network/simple-uri;1"].createInstance(Ci.nsIURI);
        uri.spec = this.spec
        return uri;
        },
    };

debug("pre");
function ViaHTTPChannel(via) { debug("new via") }
fakey_prototype = {
    classDescription: "Hides a HTTP Channel",
    classID:          Components.ID("{f6a22d08-d9ff-489c-a696-1ba59f935b7e}"),
    contractID:       "@etc.etc.com/ViaHTTPChannel;1",
    QueryInterface: XPCOMUtils.generateQI([Ci.nsIChannel]),

    asyncOpen : function(a1, a2) { 
        try {
            debug("called VIA open",a1,a2); 
            debug("LOAD_NORMAL ", this.LOAD_NORMAL);
            debug("via.LOAD_NORMAL ", this.via.LOAD_NORMAL);
            debug("originalURI",this.originalURI.spec);
            debug("URI",this.URI.spec);
            debug("via uri",this.via.URI.spec);
            this.via.asyncOpen(a1, a2);
        } catch (e) { debug(e) }
        },
    // open : function() { this.via.open() },

    /*methods*/
    cancel: function(status){
        this.via.cancel(status);
    },
    isPending: function(){
        return this.via.isPending();
    },
    resume: function(){
        this.via.resume();
    },
    suspend: function(){
        this.via.suspend();
    },
/*methods*/
    getRequestHeader: function(header){
        return this.httpChannel.getRequestHeader(header);
    },
    getResponseHeader: function(header){
        return this.httpChannel.getResponseHeader(header);
    },  
    isNoCacheResponse: function(){
        return this.httpChannel.isNoCacheResponse;
    },
    isNoStoreResponse: function(){
        return this.httpChannel.isNoStoreResponse;
    },  
    setRequestHeader: function(header , value , merge ){
        dump("Set request header " + header + " to " + value + "\n");
        this.httpChannel.setRequestHeader(header, value, merge);
    },
    setResponseHeader: function(header , value, merge ){
        dump("Set response header " + header + " to " + value + "\n");
        this.httpChannel.setResponseHeader(header, value, merge);
    },
    visitRequestHeaders: function(visitor){
        this.httpChannel.visitRequestHeaders(visitor);
    },
    visitResponseHeaders: function(visitor){
        this.httpChannel.visitResponseHeaders(visitor);
    },
    getRequestVersion: function(major,  minor){
        this.httpChannelInternal.getRequestVersion(major, minor);
    },
    getResponseVersion: function(major, minor){
        this.httpChannelInternal.getResponseVersion(major, minor);
    },
    setCookie: function(cookieHeader) {
        this.httpChannelInternal.setCookie(cookieHeader);
    },
    };
(function() {
    
    debug("setup");
    /*nsIRequest*/
    /*constants*/
    fakey_prototype.__defineGetter__('LOAD_NORMAL', function() {return this.via.LOAD_NORMAL});
    fakey_prototype.__defineGetter__('LOAD_BACKGROUND', function() {return this.via.LOAD_BACKGROUND});
    fakey_prototype.__defineGetter__('INHIBIT_CACHING', function() {return this.via.INHIBIT_CACHING});
    fakey_prototype.__defineGetter__('INHIBIT_PERSISTENT_CACHING', function() {return this.via.INHIBIT_PERSISTENT_CACHING});
    fakey_prototype.__defineGetter__('LOAD_BYPASS_CACHE', function() {return this.via.LOAD_BYPASS_CACHE});
    fakey_prototype.__defineGetter__('LOAD_FROM_CACHE', function() {return this.via.LOAD_FROM_CACHE});
    fakey_prototype.__defineGetter__('VALIDATE_ALWAYS', function() {return this.via.VALIDATE_ALWAYS});
    fakey_prototype.__defineGetter__('VALIDATE_NEVER', function() {return this.via.VALIDATE_NEVER});
    fakey_prototype.__defineGetter__('VALIDATE_ONCE_PER_SESSION', function() {return this.via.VALIDATE_ONCE_PER_SESSION});
    
    /*properties*/
    fakey_prototype.__defineGetter__('loadFlags', function() {return this.via.loadFlags});
    fakey_prototype.__defineSetter__('loadFlags', function(val) {this.via.loadFlags = val});
    fakey_prototype.__defineGetter__('loadGroup', function() {return this.via.loadGroup});
    fakey_prototype.__defineSetter__('loadGroup', function(val) {this.via.loadGroup = val});
    fakey_prototype.__defineGetter__('name', function() {return this.via.name});
    fakey_prototype.__defineGetter__('status', function() {return this.via.status});
    
    /*nsIChannel*/
    /*constants*/
    fakey_prototype.__defineGetter__('LOAD_DOCUMENT_URI', function() {return this.via.LOAD_DOCUMENT_URI});
    fakey_prototype.__defineGetter__('LOAD_RETARGETED_DOCUMENT_URI', function() {return this.via.LOAD_RETARGETED_DOCUMENT_URI});
    fakey_prototype.__defineGetter__('LOAD_REPLACE', function() {return this.via.LOAD_REPLACE});
    fakey_prototype.__defineGetter__('LOAD_INITIAL_DOCUMENT_URI', function() {return this.via.LOAD_INITIAL_DOCUMENT_URI});
    fakey_prototype.__defineGetter__('LOAD_TARGETED', function() {return this.via.LOAD_TARGETED});

    /*properties*/
    fakey_prototype.__defineGetter__('contentCharset', function() {return this.via.contentCharset});
    fakey_prototype.__defineSetter__('contentCharset', function(val) {this.via.contentCharset = val});
    fakey_prototype.__defineGetter__('contentLength', function() {return this.via.contentLength});
    fakey_prototype.__defineSetter__('contentLength', function(val) {this.via.contentLength = val});
    fakey_prototype.__defineGetter__('contentType', function() {return this.via.contentType});
    fakey_prototype.__defineSetter__('contentType', function(val) {this.via.contentType = val});
    fakey_prototype.__defineGetter__('notificationCallbacks', function() {return this.via.notificationCallbacks});
    fakey_prototype.__defineSetter__('notificationCallbacks', function(val) {this.via.notificationCallbacks = val});
    fakey_prototype.__defineGetter__('owner', function() {return this.via.owner});
    fakey_prototype.__defineSetter__('owner', function(val) {this.via.owner = val});      
    fakey_prototype.__defineGetter__('securityInfo', function() {return this.via.securityInfo});
    debug("done setup");
    })();
ViaHTTPChannel.prototype=fakey_prototype;
debug("pre2");

if (XPCOMUtils.generateNSGetFactory) {
    debug("Make",AboutFosdem, ViaHTTPChannel);
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([AboutFosdem, ViaHTTPChannel]);
  }
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([AboutFosdem, ViaHTTPChannel]);

} catch (e) { debug(e) }
