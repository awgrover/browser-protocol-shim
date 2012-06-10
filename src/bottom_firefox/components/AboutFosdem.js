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
	
        return 'http://localhost:5984/'+fres.host+(fres.path ? '/'+fres.path : '');

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
  debug("Make ",aURL," ~ ",aBaseURI.spec);
  return ioService.newURI(aURL, aOriginCharset, aBaseURI);
  }

function tryit(aSpec, aOriginCharset, aBaseURI) {
    var standardURL = Components.classes["@mozilla.org/network/standard-url;1"]
        .createInstance(Components.interfaces.nsIStandardURL);
    standardURL.init(
        Ci.nsIStandardURL.URLTYPE_STANDARD,
        0, // default port
        aSpec, 
        aOriginCharset, 
        aBaseURI
        );
    debug("turn "+aSpec+" into ",standardURL);
    debug("..host",standardURL.host,"p",standardURL.path);
    debug(":: ",standardURL,standardURL.spec,"s ",standardURL.scheme,'h ',standardURL.host,'p ',standardURL.path);
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
    var uri = Cc["@mozilla.org/network/simple-uri;1"].createInstance(Ci.nsIURI);
    uri.spec = aSpec;

    return uri;
    } catch (e) { debug(e) }
  },

  newChannel: function(aURI)
  {
    try {
        debug("break down ",aURI.path);
        pieces = aURI.path.match(/^(?:\/\/([^\/]*))?(\/?.+)?/); // approx. right
        uri = {}
        uri.host = pieces[1];
        uri.path = pieces[2];
        debug("Reparsed ",uri,'h ',uri.host,'p ',uri.path);
        var ioservice = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
        var FosdemResource = aURI.spec.split(":")[1];
        var wheretogo = WhereToGo(uri);
        var uri = ioservice.newURI(wheretogo, null, null);
        var channel = ioservice.newChannelFromURI(uri, null).QueryInterface(Ci.nsIHttpChannel);
        return channel;
    } catch (e) { debug(e) }
  },
  classDescription: "Fosdem Basic Protocol Handler",
  contractID: "@mozilla.org/network/protocol;1?name=couchdb", // must match chrome.manifest
  classID: Components.ID('{7270a1fe-7b2f-4dc0-a935-664e9941d3a3}'), // must match chrome.manifest!, descriptive for now
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIProtocolHandler])
}

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([AboutFosdem]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([AboutFosdem]);
