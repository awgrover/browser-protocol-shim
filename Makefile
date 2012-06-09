# vim set nosmarttab noexpandtab 
# vi tabstop=8 shiftwidth=8:this is the vi modeline to force tabs
firefox := $(shell which firefox)
firefox_install_dir := $(shell dirname `readlink -f $(firefox)`)
firefox_src := src/bottom_firefox
firefox_install_rdf := $(firefox_src)/install.rdf
firefox_extension_id := $(shell xmllint --xpath '//*[local-name() ="id"]/text()[not(starts-with(., "{"))]' $(firefox_install_rdf))
firefox_profile_name := development
firefox_profile_dir := realpath ~/.mozilla/firefox/318m7rgj.$(firefox_profile_name)

.PHONY : re-run
re-run: dev-install
	if [ -f .ff.pid ]; then pid=`cat .ff.pid`; ps w -p $$pid | grep $(firefox_profile_name) && kill $$pid || (echo "can't find $$pid from .ff.pid"; ps w -C firefox; false); else true; fi
	env MOZ_PURGE_CACHES=1 firefox -P $(firefox_profile_name) -no-remote& echo $$! > .ff.pid

.PHONY : dev-install
dev-install: $(firefox_profile_dir)/extensions/$(firefox_extension_id)
	echo "Check $<"

$(firefox_profile_dir)/extensions/$(firefox_extension_id) : $(firefox_src)/*/*
	echo $@
	mkdir -p `dirname $@`
	rdf=`realpath $(firefox_install_rdf)`; echo `dirname $$rdf` > $@

