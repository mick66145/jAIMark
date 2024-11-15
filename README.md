# Readme

## Overview

`aiMark` is a jQuery plugin that adds custom context menu functionality and text highlighting to selected text. The plugin enables users to interact with highlighted text and perform various actions through a custom right-click context menu. It also provides the ability to highlight selected text with a `mark` element.

## Expected Markup & Example Usage

To integrate the `aiMark` plugin into your project, follow these steps:

-----

### The JavaScript Libraries & CSS

You need to include the jQuery as well as the jAIMark libraries. For example:

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.jAIMark.js"></script>

----

### The HTML

Use the plugin with any HTML element where you want to enable text selection and context menu functionality. Here's an example:

	<div id="text-container">
        <p>畢氏定理解釋了直角三角形中兩股與斜邊的平方關係</p>
    </div>

You can apply the plugin to any container element, such as div, p, or span. The text within these elements can be highlighted and interacted with using the plugin's context menu.

-----

### The jQuery Call

To initialize the aiMark plugin, make the jQuery call and specify any desired options. For example:

	jQuery(document).ready(function() {
	    $("#text-container").aiMark({});
	});

----