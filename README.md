AccidentalFish AngularJS Pack
=============================

While learning [AngularJS](https://angularjs.org/) and working on [AzureLinkboard](https://github.com/JamesRandall/AzureLinkboard) I've started to spin out a set of directives and services that I think might be generally useful into a code pack. I'm pretty new to [AngularJS](https://angularjs.org/) so as my experience and knowledge grow hopefully the code quality of this pack will improve correspondingly. 

[AzureLinkboard](https://github.com/JamesRandall/AzureLinkboard) is built with Bootstrap 3 and Web API on the server side so the AngularJS code pack is focussed in this area.

The code for the pack can be found in the app folder of this repository in a sub-folder designed to sit alongside your app code (on the basis you have a app folder with a controllers, services, views sub-structure).

I'll get this built as a [Bower](http://bower.io/) pack shortly.


Bootstrap Boilerplate
---------------------

There's an awful lot of boilerplate code involved in building a Bootstrap form with form groups, labels etc. all requiring very careful placement. I've begun to wrap these into a set of directives that are documented below (expect this list to expand quite rapidly).

Currently these all work for forms that are in a horizontal layout (so the form has a *form-horizontal* class applied).

To use these element based directives include the script *afCustomInputs.js* and add *afCustomInputs* as an application dependency. An example of registering this dependency with your application, based on [AzureLinkboard](https://github.com/JamesRandall/AzureLinkboard) is shown below.

    var app = angular.module('AzureLinkboardApp', ['ngRoute',
        'LocalStorageModule',
        'angular-loading-bar',
        'infinite-scroll',
        'linkboardControllers',
        'afCustomInputs',
        'afServerValidation']);

### &lt;af-text-input&gt;

Wrapper for a textbox with a label and a * icon at the right of the input field if it is required.

#### Properties

Attribute|Description
---------|-----------
af-label  |Text for the label. Note that this is an Angular expression so a string literal must be escaped with quotes.
af-name   |The name to give the form element. Note that this is an Angular expression so a string literal must be escaped with quotes.
af-type   |The type of the input box. Defaults to text (other examples are Angular based and include email and url to apply those validations).
autofocus |As per standard HTML.
maxlength |As per standard HTML.
ng-model  |The model to bind the textbox to.
required  |As per standard HTML. Adds a * symbol to the right of the textbox.

#### Example

The below use of the directive:

    <af-text-input af-type="'email'"
                   ng-model="loginData.userName"
                   af-name="'email'"
                   af-label="'Email'"
                   autofocus
                   required>
    </af-text-input>
    
Yields (with some of the Angular runtime added bindings removed for clarity):

    <div class="form-group has-feedback">
        <label for="email"
               class="control-label col-md-2">Email</label>
        <div class="col-md-10">
            <input type="email"
                   name="email"
                   class="form-control"
                   ng-model="ngModel"
                   autofocus="autofocus"
                   required="required">
            <span class="glyphicon glyphicon-certificate form-control-feedback form-feedback-required">
            </span>
        </div>
    </div>
    
### &lt;af-text-area&gt;

Wrapper for a textarea tag with a label.

#### Properties

Attribute|Description
---------|-----------
af-label  |Text for the label. Note that this is an Angular expression so a string literal must be escaped with quotes.
af-name   |The name to give the form element. Note that this is an Angular expression so a string literal must be escaped with quotes.
autofocus |As per standard HTML.
maxlength |As per standard HTML.
ng-model  |The model to bind the textbox to.
required  |As per standard HTML. Adds a * symbol to the right of the textbox.
rows      |As per standard HTML.

#### Example

The below use of the directive:

    <af-text-area ng-model="newLink.Description"
                  maxlength="1024"
                  rows="5"
                  af-name="'description'"
                  af-label="'Description'"></af-text-area>
                  
Yields (with some of the Angular runtime added bindings removed for clarity):

    <div class="form-group has-feedback">
        <label for="description"
               class="control-label col-md-2">Description</label>
        <div class="col-md-10">
            <textarea name="description"
                      class="form-control"
                      ng-model="ngModel"
                      maxlength="1024"
                      rows="5"></textarea>
        </div>
    </div>
    
### &lt;af-SubmitButton&gt;

Wrapper for a submit button.

#### Properties

Attribute|Description
---------|-----------
ng-click |Click event handler


#### Example

The below use of the directive:

    <af-submit-button ng-click="doChangePassword()"></af-submit-button>
    
Yields:

    <div class="row">        <div class="col-md-12">            <div class="pull-right">
                <button class="btn btn-info btn-block"
                         type="submit"
                         data-ng-click="ngClick">Submit</button>
            </div>        </div>    </div>


Web API
-------

### Validation

You can roll your own validation but if you stick to the model state approach with the System.ComponentModel.DataAnnotations attributes then you'll probably want to wrap this a little to make it a little more client friendly.

To keep a nice user friendly client app you'll want to implement as many validations as you can within AngularJS repeated on the server API to protect the servers data integrity and supplemented with final validations that can only be done on the server (such as unique username checks).

The support for validation is in two halves. A service that processes server responses into a standard format suitable for binding to and a directive that binds to these responses to present a list of bullet point errors.

#### afWebApiValidationService - Parsing Server Responses

This is a service that your $http responses (success and failure) can be passed to. It's designed to sit within a deferred promise. The below example of its usage is from AzureLinkboard that posts a new link to the server:

    saveLink: function(link) {
        var queryUrl = serviceBase + 'api/url';
        var deferred = $q.defer();
        $http.post(queryUrl, link).then(function(results) {
            deferred.resolve(webApiValidationService.handleSuccess(results));
        }, function(error) {
            deferred.reject(webApiValidationService.handleError(error));
        });
        return deferred.promise;
    }
    
Both handleSuccess and handleError build a structure as follows (the example below is for an error):

    {
        attemptedSave: true,
        status: response.status,
        message: response.data.Message,
        isModelError: true,
        savedSuccessfully: false,
        data: null,
        errors: {
          // key value pairs
        },
        errorList: [ // flattened messages ]
    }

In a successful scenario the structure will be populated as follows:

    {
        status: 200,
        attemptedSave: true,
        message: response.message,
        isModelError: false,
        savedSuccessfully: true,
        data: response.data,
        errors: null,
        errorList: null
    }

To aid in binding to the above a default pre-save model can be obtained from the service using the defaultModel() function that returns a structure as below:

    {
        attemptedSave: false,
        status: 200,
        message: null,
        isModelError: false,
        errors: null,
        errorList: null,
        data: null,
        savedSuccessfully: false
    }

An example of how to use this in a controller, along with a service, can be found in the [AzureLinkboard sign up controller](https://github.com/JamesRandall/AzureLinkboard/blob/master/Server/AzureLinkboard.Web/app/controllers/signupController.js) and the directive documented below can parse the above structure to present a bulleted list of errors.

#### &lt;af-server-validation&gt; - Presenting Server Error Messages

This element directive can be used to bind to the structure returned from the above service to show a list of error bullet points.

Assuming you've populated a property called saveResult on your controller with one of the above models then to show the error list all you need do is copy the following example:

    <af-server-validation key="saveResult"></af-server-validation>

Again see [AzureLinkboard](https://github.com/JamesRandall/AzureLinkboard) for examples of it in use.


License
-------
Copyright (C) 2014 Accidental Fish Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.