import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Utente} from '../../model/utente.model';
import {RegistrazioneService} from '../../services/registrazione.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {RegistrazioneDocenteModalPage} from '../registrazione-docente-modal/registrazione-docente-modal.page';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
    selector: 'app-registrazione',
    templateUrl: './registrazione.page.html',
    styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {
    private registrazioneFormModel: FormGroup;
    passwordType = 'password';
    passwordShow = false;
    public toogle = false;
    croppedImagepath = '';
    img = false;
    isLoading = false;

    imagePickerOptions = {
        maximumImagesCount: 1,
        quality: 50
    };

    constructor(
        public formBuilder: FormBuilder,
        // public utente: Utente,
        private storage: Storage,
        public registrazioneService: RegistrazioneService,
        public modalController: ModalController,
        private camera: Camera,
        private crop: Crop,
        public actionSheetController: ActionSheetController,
        private file: File
    ) {
    }

// vuole tutti i campi perchè si deve aspettare qualcosa
    ngOnInit() {
        this.registrazioneFormModel = this.formBuilder.group({
            // le cose che scrivo dentro [] le ritrovo sulla page registrazione.html
            nome: [''],
            cognome: [''],
            email: [''],
            password: [''],
            datanascita: [],
            regione: [''],
            citta: [''],
            cap: [],
            via: [''],
            civico: [],
            biografia: ['']
        });
    }

    // PER IMAGINI DALLA FOTOCAMERA O GALLERIA
    pickImage(sourceType) {
        const options: CameraOptions = {
            quality: 100,
            sourceType,
            correctOrientation: true,
            saveToPhotoAlbum: true,
            targetWidth: 720,
            targetHeight: 720,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            // let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.cropImage(imageData);
        }, (err) => {
            // Handle error
        });
    }

    async selectImage() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Select Image source',
            buttons: [{
                text: 'Load from Library',
                handler: () => {
                    this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.pickImage(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    cropImage(fileUrl) {
        this.crop.crop(fileUrl, { quality: 100, targetWidth: -1, targetHeight: -1 })
            .then(
                newPath => {
                    this.showCroppedImage(newPath.split('?')[0]);
                },
                error => {
                    alert('Error cropping image' + error);
                }
            );
    }

    showCroppedImage(ImagePath) {
        this.isLoading = true;
        const copyPath = ImagePath;
        const splitPath = copyPath.split('/');
        const imageName = splitPath[splitPath.length - 1];
        const filePath = ImagePath.split(imageName)[0];

        this.file.readAsDataURL(filePath, imageName).then(base64 => {
            this.croppedImagepath = base64;
            console.log(base64);
            this.isLoading = false;
            this.img = true;
        }, error => {
            alert('Error in showing image' + error);
            this.isLoading = false;
        });
    }

    public togglePassword() {
        if (this.passwordShow) {
            this.passwordShow = false;
            this.passwordType = 'password';
        } else {
            this.passwordShow = true;
            this.passwordType = 'text';
        }
    }

    prendiRegistrazione() {
        const utente: Utente = this.registrazioneFormModel.value;
        this.registrazioneService.setStoreRegistrazione('ute', utente);
        this.registrazioneService.postRegistrazione(utente).subscribe((prendeMessaggi) => {
            console.log(prendeMessaggi);
        });
        // this.registrazioneService.getRegistrazione()
        // console.log(JSON.stringify(utente));
        // console.log(this.registrazioneFormModel.value);
        // console.log(utente1);
    }
    async openModal() {
        const modal = await this.modalController.create({
            component: RegistrazioneDocenteModalPage
        });

        modal.onDidDismiss().then((dataReturned) => {
            /*if (dataReturned !== null) {
                this.dataReturned = dataReturned.data;
                //alert('Modal Sent Data :'+ dataReturned);
            }*/
            console.log('i dati sono: ' + dataReturned.data);
        });

        await modal.present();
    }

    notify() {
        if (this.toogle) {
            this.toogle = false;
            console.log(this.toogle);
        } else {
            this.toogle = true;
            console.log(this.toogle);
            this.openModal();
        }
    }

    notifyCondition() {
        console.log(this.toogle);
        if (this.toogle) {
            this.openModal();
        }
    }
}
