# How Long?

Is an angular app to help you estimate the completion time of a long running
task.

## Installation

`npm install`

## To run locally

`npm start`

Then open http://localhost:8000/dist

## Todo

* Make `enter` key work for the time or the value field
* Make first time field prepoluate with the time right now. Even if this isn't what the user wants, it at least models how to use the field in case --:-- is confusing.
* Do something with SCSS errors so it doesn't break the server
* If neg values aren't allowed for the sample inputs; don't allow for the final input
* Show the 0%, 50%, 100% tick lines by default
* Move the `empty-state` class to point to the relevant input after the first value has been entered
