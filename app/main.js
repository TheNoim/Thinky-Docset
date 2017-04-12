import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMarked from 'angular-marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'angular-material/angular-material.min.css';


const app = angular.module('Thinky', [ngMaterial, ngMarked]);

app.controller('Thinky', function ($scope) {
    $scope.Sources = {
        Quickstart: require('raw-loader!./Markdown/Quickstart.md'),
        Introduction: require('raw-loader!./Markdown/Introduction.md'),
        Importing_thinky: require('raw-loader!./Markdown/Importing_thinky.md'),
        Schemas: require('raw-loader!./Markdown/Schemas.md'),
        Relations: require('raw-loader!./Markdown/Relations.md'),
        VirtualFields: require('raw-loader!./Markdown/VirtualFields.md'),
        Changefeeds: require('raw-loader!./Markdown/Changefeeds.md'),
        API: require('raw-loader!./Markdown/API.md')
    };
    angular.element(document).ready(function () {
        setTimeout(() => {
            document.getElementById(window.location.hash.replace('#', '')).scrollIntoView();
        }, 400);
    });
});

app.config(['markedProvider', function (markedProvider) {
    markedProvider.setOptions({
        gfm: true,
        tables: true,
        highlight: function (code, lang) {
            if (lang) {
                return '<div flex layout-padding>' + hljs.highlight(lang, code, true).value + '</div>';
            } else {
                return hljs.highlightAuto(code).value;
            }
        }
    });
}]);

app.config(function ($mdThemingProvider) {
    const customPrimary = {
        '50': '#616161',
        '100': '#545454',
        '200': '#474747',
        '300': '#3a3a3a',
        '400': '#2e2e2e',
        '500': '#212121',
        '600': '#141414',
        '700': '#070707',
        '800': '#000000',
        '900': '#000000',
        'A100': '#6d6d6d',
        'A200': '#7a7a7a',
        'A400': '#878787',
        'A700': '#000000'
    };
    $mdThemingProvider
        .definePalette('customPrimary',
            customPrimary);

    const customAccent = {
        '50': '#beab00',
        '100': '#d7c200',
        '200': '#f1d800',
        '300': '#ffe60b',
        '400': '#ffe925',
        '500': '#ffeb3e',
        '600': '#fff171',
        '700': '#fff38b',
        '800': '#fff6a4',
        '900': '#fff8be',
        'A100': '#fff171',
        'A200': '#ffee58',
        'A400': '#ffeb3e',
        'A700': '#fffbd7'
    };
    $mdThemingProvider
        .definePalette('customAccent',
            customAccent);

    const customWarn = {
        '50': '#ffc780',
        '100': '#ffbc66',
        '200': '#ffb14d',
        '300': '#ffa533',
        '400': '#ff9a1a',
        '500': '#ff8f00',
        '600': '#e68100',
        '700': '#cc7200',
        '800': '#b36400',
        '900': '#995600',
        'A100': '#ffd299',
        'A200': '#ffddb3',
        'A400': '#ffe9cc',
        'A700': '#804800'
    };
    $mdThemingProvider
        .definePalette('customWarn',
            customWarn);

    const customBackground = {
        '50': '#888888',
        '100': '#7b7b7b',
        '200': '#6e6e6e',
        '300': '#616161',
        '400': '#555555',
        '500': '#484848',
        '600': '#3b3b3b',
        '700': '#2e2e2e',
        '800': '#222222',
        '900': '#151515',
        'A100': '#949494',
        'A200': '#a1a1a1',
        'A400': '#aeaeae',
        'A700': '#080808'
    };
    $mdThemingProvider
        .definePalette('customBackground',
            customBackground);

    $mdThemingProvider.theme('default')
        .primaryPalette('customPrimary')
        .accentPalette('customAccent')
        .warnPalette('customWarn')
        .backgroundPalette('customBackground')
});