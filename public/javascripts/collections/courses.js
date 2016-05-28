//
// Verify view
//
define([], function() {
    console.log('collections/courses.js');
    var Collection = Backbone.Collection.extend({
        url: "/course"
    });
    return Collection;
});