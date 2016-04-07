//
// Internationalization
//
define([
    "replace!locale"
], function(locale, easyui) {
    console.log('i18n.js');
    var polyglot = new Polyglot({
        phrases: locale
    });
    moment.locale(LANG);
    return polyglot;
});