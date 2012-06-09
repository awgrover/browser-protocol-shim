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

AboutFosdem.prototype = {
  scheme: "apps",
  protocolFlags: nsIProtocolHandler.URI_NORELATIVE |
                 nsIProtocolHandler.URI_NOAUTH |
                 nsIProtocolHandler.URI_LOADABLE_BY_ANYONE,

  newURI: function(aSpec, aOriginCharset, aBaseURI)
  {
    var uri = Cc["@mozilla.org/network/simple-uri;1"].createInstance(Ci.nsIURI);
    uri.spec = aSpec;
    return uri;
  },

  newChannel: function(aURI)
  {
    var ioservice = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
    var FosdemResource = aURI.spec.split(":")[1];
    var wheretogo = WhereToGo(FosdemResource);
    var uri = ioservice.newURI(wheretogo, null, null);
    var channel = ioservice.newChannelFromURI(uri, null).QueryInterface(Ci.nsIHttpChannel);
    return channel;
  },
  classDescription: "Fosdem Basic Protocol Handler",
  contractID: "@mozilla.org/network/protocol;1?name=apps", // must match chrome.manifest
  classID: Components.ID('{7270a1fe-7b2f-4dc0-a935-664e9941d3a3}'), // must match chrome.manifest!, descriptive for now
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIProtocolHandler])
}

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([AboutFosdem]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([AboutFosdem]);
