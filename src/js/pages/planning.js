import $ from "jquery";

let $otherCheckbox = $('.js-checkbox-other'),
    $hidingFieldset = $('.js-hiding-fieldset');

$otherCheckbox.on("change", function() {
    $hidingFieldset.slideToggle();
});

//tooltip

let $tipImage = $('.js-tip-image'),
    $tipPopup = $('.js-tip-popup');

$tipImage.on('click', function (e) {
    $(this).next($tipPopup).slideToggle();
});