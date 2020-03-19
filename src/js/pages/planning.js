import $ from "jquery";

let $otherCheckbox = $('.js-checkbox-other'),
    $hidingFieldset = $('.js-hiding-fieldset');

$otherCheckbox.on("change", function() {
    $hidingFieldset.slideToggle();
});