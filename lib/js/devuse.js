// ----------------------------------------------------------
// devuse.js - Developer Use
//
// Use this script for developing new functions and features
// without messing up existing code. Once you work out all the
// issues then move it over to the regular javascript files
//
// -----------------------------------------------------------

console.log('devuse.js loaded');

import { loadIframeTemplate } from "/sae/lib/js/modules/ui.js";

const url1 = '?tpl=spinner&head=New%20Header%20One&img=blocks&msg=This%20is%20a%20new%20spinner%20message 1';
const url2 = '?tpl=spinner&head=New%20Header%20Two&img=gears&msg=This%20is%20a%20new%20spinner%20message 2';
const url3 = '?tpl=spinner&head=New%20Header%20Three&img=blocks&msg=This%20is%20a%20new%20spinner%20message 3';
const url4 = '?tpl=spinner&head=New%20Header%20Four&img=gears&msg=This%20is%20a%20new%20spinner%20message 4';

const urlArr = [url1, url2, url3, url4];

console.log('Array is: ', urlArr);

loadIframeTemplate(urlArr[0]);



// let ui = document.getElementById('ui');
// ui.innerHTML = `<h3 style="text-align:center; font-family: monospace; margin-top: 100px; color: #878787;">Ready...</h3>`;
// ui.style.display = 'block';