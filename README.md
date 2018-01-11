# Whistle

An anonymous reporting application with in-browser PGP encryption.

## How does it work?

A set of trusted persons (trustees) are predefined. A trustee are a person the reporter choose to report to.

To become a valid trustee, the trustee must generate a PGP key pair (in browser following generated url). The public key will be stored in the backend. The private key must be stored by the trustee.

When a person starts the reporting process (the reporter), a PGP key pair is generated at first then the report is initialized. The public key will be stored in plaintext in the backend with the report itself. The reporter then chooses which trustee to report to and the trustee public key will be retrieved in browser. All input fields in the report will now be encrypted using reporters private key and trustee's public key before the content is stored in the backend at the reporters will.

The trustee will be notified when the report is published by the reporter.

There is no means of notifying the reporter and as such only checking the url given after creating the report will give the reporter updates to the progress and the possibility to communicate with the trustee. 

The url given the reporter contains all information necessary to open and decrypt the report. 

The url received by the trustee do not contain the private key, hence the trustee will need to supply the private key before beeing able to decrypt the report.

All files used in the application shall be publicly available:
* This project, whistle, which is the frontend/client which lives in the browser
* The backend, whistle-backend
* Relevant configuration files from the server

By doing so one can label the backend as unsecure, but all files used to build the client are publicly available both via http on the application server and this repository. Hence the integrity of the files used by the browser can be verified, either by the user or by using 3rd party online tools.

The server the application runs on shall not be in control of the developers or any organisation which the reporter is inclined to report on. Instead an agreement/contract between the organisation(s) and the 3rd party provider shall be made and also be publicly available.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
