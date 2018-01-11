import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { WindowRef } from './WindowRef';

declare var openpgp: any;

@Component({
  selector: 'app-pgp',
  templateUrl: './pgp.component.html',
  styleUrls: ['./pgp.component.css']
})
export class PgpComponent implements OnInit {

  openpgp: any;
  jan: any;
  anon: any;
  msg = 'Heisann sveisann dette er en string med noen tegn i, som åæø og - + =/&"&#';
  anonEncryptedMsg: string;
  janDecryptedMsg: string;
  dataready = false;
  forurl: string;
  fromurl: string;
  fromurlTest: string;
  constructor(private winRef: WindowRef) {


  }

  ngOnInit() {
    console.log('OPENPGPG');
    console.log(this.winRef.nativeWindow.openpgp);
    this.openpgp = this.winRef.nativeWindow.openpgp; // require('openpgp');

    this.openpgp.initWorker({ path: 'assets/openpgp.worker.js' }); // set the relative web worker path

    this.openpgp.config.aead_protect = true; // activate fast AES-GCM mode (not yet OpenPGP standard)

    const janoptions = {
      userIds: [{ name: 'Jan', email: 'jan@nlf.no' }], // multiple user IDs
      numBits: 2048,                                            // RSA key size
      passphrase: ''         // protects the private key
    };

    const anonoptions = {
      userIds: [{ name: 'Anon', email: 'anon@nlf.no' }], // multiple user IDs
      numBits: 2048,                                            // RSA key size
      passphrase: ''         // protects the private key
    };

    this.openpgp.generateKey(janoptions)
      .then((key) => {
        console.log('GENERATE JAN');
        console.log(key);
        // {'private': key.privateKeyArmored, 'public': key.publicKeyArmored};
        console.log(key.publicKeyArmored);
        console.log(key.privateKeyArmored);
        return key;
      }).then((jankey) => {
        console.log(jankey);
        this.jan = jankey;
        this.openpgp.generateKey(anonoptions)
          .then((key) => {
            console.log('GENERATE ANON');
            //{'private': key.privateKeyArmored, 'public': key.publicKeyArmored};
            console.log(key.publicKeyArmored);
            console.log(key.privateKeyArmored);
            return key;
          }).then((anonkey) => {
            this.anon = anonkey;
            console.log('Encrypt');

            const anonprivKeyObj = this.openpgp.key.readArmored(this.anon.privateKeyArmored).keys[0];
            anonprivKeyObj.decrypt('');

            const encryptoptions = {
              data: this.msg,                             // input as String (or Uint8Array)
              publicKeys: this.openpgp.key.readArmored(this.jan.publicKeyArmored).keys,  // for encryption
              privateKeys: anonprivKeyObj // for signing (optional)
            };

            this.openpgp.encrypt(encryptoptions).then( (ciphertext) => {

              return ciphertext; //.data; // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
            })
              .then((encrypted) => {
                console.log('Encrypted');
                console.log(encrypted);
                this.anonEncryptedMsg = encrypted.data;

                const janprivKeyObj = this.openpgp.key.readArmored(this.jan.privateKeyArmored).keys[0];
                janprivKeyObj.decrypt('');

                const decryptoptions = {
                  message: openpgp.message.readArmored(encrypted.data),     // parse armored message
                  publicKeys: openpgp.key.readArmored(this.anon.publicKeyArmored).keys,    // for verification (optional)
                  privateKey: janprivKeyObj // for decryption
                };

                openpgp.decrypt(decryptoptions)
                  .then(function (plaintext) {

                    return plaintext; // 'Hello, World!'
                  }).then((decrypted) => {
                    console.log('DECRYPTED');
                    console.log(decrypted);
                    this.janDecryptedMsg = decrypted.data;
                    this.dataready = true;

                    this.forurl = btoa(JSON.stringify({'uuid': 'kewjorwjuioeruioewrirhiuahiuyhai', 
                    'private': this.anon.privateKeyArmored,
                    'public': this.anon.publicKeyArmored}));

                    this.fromurl = atob(this.forurl);

                    this.fromurlTest = JSON.parse(this.fromurl).uuid;

                  });
              });
          });
      });



  }

  keygen(numBits, name, email, passphrase) {

    const options = {
      userIds: [{ name: name, email: email }], // multiple user IDs
      numBits: numBits,                                            // RSA key size
      passphrase: passphrase         // protects the private key
    };

    this.openpgp.generateKey(options).then(function (key) {
      console.log('GENERATE');
      console.log(key);
      return { private: key.privateKeyArmored, public: key.publicKeyArmored };
    });
  }

  encrypt_message(pubkey, privkey, passphrase, message) {

    const privKeyObj = this.openpgp.key.readArmored(privkey).keys[0];
    privKeyObj.decrypt(passphrase);

    const options = {
      data: message,                             // input as String (or Uint8Array)
      publicKeys: this.openpgp.key.readArmored(pubkey).keys,  // for encryption
      privateKeys: privKeyObj // for signing (optional)
    };

    this.openpgp.encrypt(options).then(function (ciphertext) {
      this.anonEncryptedMsg = ciphertext.data;
      return ciphertext.data; // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
    });

  }

  decrypt_message(pubkey, privkey, passphrase, encrypted) {

    const privKeyObj = this.openpgp.key.readArmored(privkey).keys[0];
    privKeyObj.decrypt(passphrase);

    const options = {
      message: openpgp.message.readArmored(encrypted),     // parse armored message
      publicKeys: openpgp.key.readArmored(pubkey).keys,    // for verification (optional)
      privateKey: privKeyObj // for decryption
    };

    openpgp.decrypt(options).then(function (plaintext) {
      this.janDecryptedMsg = plaintext.data;
      this.dataready = true;
      return plaintext.data; // 'Hello, World!'
    });



  }


}
