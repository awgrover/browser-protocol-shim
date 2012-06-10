# vim set nosmarttab noexpandtab 
# vi tabstop=8 shiftwidth=8:this is the vi modeline to force tabs
firefox := $(shell which firefox)
firefox_install_dir := $(shell dirname `readlink -f $(firefox)`)
firefox_src := src/bottom_firefox
firefox_install_rdf := $(firefox_src)/install.rdf
firefox_extension_id := $(shell xmllint --xpath '//*[local-name() ="id"]/text()[not(starts-with(., "{"))]' $(firefox_install_rdf))
firefox_profile_name := development
firefox_profile_dir := $(shell realpath ~/.mozilla/firefox/318m7rgj.$(firefox_profile_name))
# FIXME: name
tmpl_derived := $(shell find $(firefox_src) -type f -name '*.tmpl' | sed 's/\.tmpl// )

.PHONY : re-run
re-run: dev-install $(tmpl_derived)
	if [ -f .ff.pid ]; then pid=`cat .ff.pid`; ps w -p $$pid | grep $(firefox_profile_name) && kill $$pid || (echo "can't find $$pid from .ff.pid"; ps w -C firefox; false); else true; fi
	env MOZ_PURGE_CACHES=1 firefox -P $(firefox_profile_name) -no-remote apps:about& echo $$! > .ff.pid

.PHONY : dev-install
dev-install: $(firefox_profile_dir)/extensions/$(firefox_extension_id)
	@ echo "Dev 'pointer' $< ==>> " `cat $<`

$(firefox_profile_dir)/extensions/$(firefox_extension_id) : $(firefox_src)/*/*
	echo "ID" $@
	mkdir -p `dirname $@`
	rdf=`realpath $(firefox_install_rdf)`; echo `dirname $$rdf` > $@

# build files from templates
% : %.tmpl $(firefox_src)/guid
	tools/cutnpaste_template.pm $< $(firefox_src)/guid > $@
