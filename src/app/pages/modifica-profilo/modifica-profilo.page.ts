import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Student} from '../../model/student.model';
import {RegisterBirthdayValidator} from '../../validators/registerBirthday.validator';
import {Teacher} from '../../model/teacher.model';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {Crop} from '@ionic-native/crop/ngx';
import {ActionSheetController, AlertController, NavController} from '@ionic/angular';
import {File} from '@ionic-native/file/ngx';
import {sha512} from 'js-sha512';
import {HttpErrorResponse} from '@angular/common/http';
import {LinguaService} from '../../services/lingua.service';

@Component({
    selector: 'app-modifica-profilo',
    templateUrl: './modifica-profilo.page.html',
    styleUrls: ['./modifica-profilo.page.scss'],
})
export class ModificaProfiloPage implements OnInit {
    private utente$: BehaviorSubject<any>;
    private teacherFormModel: FormGroup;
    private studentFormModel: FormGroup;
    public passwordType = 'password';
    public passwordShow = false;
    croppedImagepath = '';
    img = false;
    isLoading = false;

    private errorTitle: string;
    private pwdMessageError: string;
    private imageSourceHeader: string;
    private loadLibraryText: string;
    private useCameraText: string;
    private cancelButton: string;
    private imageCroppingError: string;
    private imageShowingError: string;

    imagePickerOptions = {
        maximumImagesCount: 1,
        quality: 50
    };

    validationMessages = {
        email: [
            {type: 'required', message: 'email is required.'},
            {type: 'minlength', message: 'email must be at least 5 characters long.'},
            {type: 'pattern', message: 'Your email is invalid'},
            {type: 'validEmail', message: 'Your email has already been taken.'}
        ],
        password: [
            {type: 'required', message: 'Password is required'}
        ],
        name: [
            {type: 'required', message: 'Name is required'}
        ],
        surname: [
            {type: 'required', message: 'Surname is required'}
        ],
        birthday: [
            {type: 'required', message: 'birthday is required'},
            {type: 'validAge', message: 'You must be 18 years old'}
        ]
    };

    constructor(private userService: UserService,
                private translateService: TranslateService,
                private formBuilder: FormBuilder,
                private camera: Camera,
                private crop: Crop,
                public actionSheetController: ActionSheetController,
                private file: File,
                private navController: NavController,
                private alertController: AlertController,
                private linguaService: LinguaService,
                private translate: TranslateService) {
}

    /**
     * prendo in dati dal server attraverso la funzione getUser
     * alla variabile croppedImagepath (immagine presa dalla galleria) gli assegno l'immagione presa dal server
     * in base al ruolo vedo quale Form di inizializzazione e settaggio dei valori chiamare
     */
    ngOnInit() {
        this.utente$ = this.userService.getUser();
        this.initTranslate();
        this.croppedImagepath = this.utente$.value.image;
        console.log(this.utente$.value.roles);
        if (this.utente$.value.roles === 1) {
            this.initFormStudent(this.utente$.value);
        } else {
            this.initFormTeacher(this.utente$.value);
        }
        this.utente$.subscribe((user) => {
            if (user.roles === 1) {
                this.setValuesFormStudent(user);
            } else {
                this.setValuesFormTeacher(user);
            }
        });
    }

    /**
     * inizializzazione della form studente
     * gli passo un oggetto student di tipo Student perchè tra lo Student ed il Teacher hanno campi diversi
     * " name:, surname:, passwordvecchia: ..." devono avere lo stesso nome dei campi input del di modifica-profilo.html
     * le cose che scrivo dentro [] le ritrovo sulla page modifica-profilo.html
     * birthday lo converto in una data sennò il datetime non lo riconosce perchè non è nello stesso formato
     * language lo converto in un numero perchè nell'user.model/server è salvato come booleano
     */
    initFormStudent(student: Student) {
        this.studentFormModel = this.formBuilder.group({
            name: [student.name, Validators.required],
            surname: [student.surname, Validators.required],
            passwordVecchia: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
            ])],    // VECCHIA PASSWORD
            password: [''],            // NUOVA PASSWORD
            birthday: [new Date(student.birthday).toISOString(), Validators.compose([
                Validators.required,
                RegisterBirthdayValidator.isAdult
            ])],
            studyGrade: [student.studyGrade],
            languageNumber: [(+student.language).toString(), Validators.required]
        });
    }

    /**
     * Settaggio dei valori dello studente nella form
     */
    setValuesFormStudent(student: Student) {
        this.studentFormModel.controls.name.setValue(student.name);
        this.studentFormModel.controls.surname.setValue(student.surname);
        this.studentFormModel.controls.passwordVecchia.reset();
        this.studentFormModel.controls.password.reset();
        this.studentFormModel.controls.birthday.setValue(new Date(student.birthday).toISOString());
        this.studentFormModel.controls.studyGrade.setValue(student.studyGrade);
        this.studentFormModel.controls.languageNumber.setValue((+student.language).toString());
    }

    /**
     * inizializzazione della form docente
     * gli passo un oggetto teacher di tipo Teacher perchè tra lo Student ed il Teacher hanno campi diversi
     * " name:, surname:, passwordvecchia: ..." devono avere lo stesso nome dei campi input del di modifica-profilo.html
     * le cose che scrivo dentro [] le ritrovo sulla page modifica-profilo.html
     * birthday lo converto in una data sennò il datetime non lo riconosce perchè non è nello stesso formato
     * language lo converto in un numero perchè nell'user.model/server è salvato come booleano
     */
    initFormTeacher(teacher: Teacher) {
        this.teacherFormModel = this.formBuilder.group({
            name: [teacher.name, Validators.required],
            surname: [teacher.surname, Validators.required],
            passwordVecchia: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
            ])],    // VECCHIA PASSWORD
            password: [''],            // NUOVA PASSWORD
            birthday: [new Date(teacher.birthday).toISOString(), Validators.compose([
                Validators.required,
                RegisterBirthdayValidator.isAdult
            ])],
            region: [teacher.region, Validators.required],
            city: [teacher.city, Validators.required],
            postCode: [teacher.postCode, Validators.required],
            street: [teacher.street, Validators.required],
            streetNumber: [teacher.streetNumber, Validators.required],
            byography: [teacher.byography, Validators.required],
            languageNumber: [(+teacher.language).toString(), Validators.required]
        });
    }

    /**
     * Settaggio dei valori del docente nella form
     */
    setValuesFormTeacher(teacher: Teacher) {
        this.teacherFormModel.controls.name.setValue(teacher.name);
        this.teacherFormModel.controls.surname.setValue(teacher.surname);
        this.teacherFormModel.controls.passwordVecchia.reset();
        this.teacherFormModel.controls.password.reset();
        this.teacherFormModel.controls.birthday.setValue(new Date(teacher.birthday).toISOString());
        this.teacherFormModel.controls.region.setValue(teacher.region);
        this.teacherFormModel.controls.city.setValue(teacher.city);
        this.teacherFormModel.controls.postCode.setValue(teacher.postCode);
        this.teacherFormModel.controls.street.setValue(teacher.street);
        this.teacherFormModel.controls.streetNumber.setValue(teacher.streetNumber);
        this.teacherFormModel.controls.byography.setValue(teacher.byography);
        this.teacherFormModel.controls.languageNumber.setValue((+teacher.language).toString());
    }

    /**
     * Occhio onnivegente
     */
    public togglePassword() {
        if (this.passwordShow) {
            this.passwordShow = false;
            this.passwordType = 'password';
        } else {
            this.passwordShow = true;
            this.passwordType = 'text';
        }
    }

    /**
     * Questa funzione viene eseguita una volta che clicco sl pulsante SALVA su modifica-profilo
     * in base al ruolo vedo quale oggetto creare
     * se viene immessa una Nuova password questa viene criptata e diventerà la mia attuale password e lo assegno al campo password
     * altrimenti gli assegno la password Vecchia criptata
     * al nuovo oggetto creato gli assegno i valori dentro i campi della form
     * se l'immagine esiste, all'oggetto.image gli assegno la foto (sia se è rimasta la stessa oppure se è stata presa dalla Galleria)
     * chiamo la funzione che mi esegue la Modifica
     */
    salvaModifica() {
        if (this.utente$.value.roles === 1) {
            let student: Student;
            student = this.utente$.getValue();
            if (this.studentFormModel.controls.password.value) {
                student.password = sha512(this.studentFormModel.controls.password.value).toUpperCase();
            } else {
                student.password = sha512(this.studentFormModel.controls.passwordVecchia.value).toUpperCase();
            }
            student.name = this.studentFormModel.controls.name.value;
            student.surname = this.studentFormModel.controls.surname.value;
            student.birthday = new Date(this.studentFormModel.controls.birthday.value).getTime();
            student.studyGrade = this.studentFormModel.controls.studyGrade.value;
            student.language = Boolean(parseInt(this.studentFormModel.controls.languageNumber.value, 0));
            if (this.img) {
                student.image = this.croppedImagepath;
            }
            this.eseguiModifica(student);
        } else {
            let teacher: Teacher;
            teacher = this.utente$.getValue();
            if (this.teacherFormModel.controls.password.value) {
                teacher.password = sha512(this.teacherFormModel.controls.password.value).toUpperCase();
            } else {
                teacher.password = sha512(this.teacherFormModel.controls.passwordVecchia.value).toUpperCase();
            }
            teacher.name = this.teacherFormModel.controls.name.value;
            teacher.surname = this.teacherFormModel.controls.surname.value;
            teacher.birthday = new Date(this.teacherFormModel.controls.birthday.value).getTime();
            teacher.region = this.teacherFormModel.controls.region.value;
            teacher.city = this.teacherFormModel.controls.city.value;
            teacher.postCode = this.teacherFormModel.controls.postCode.value;
            teacher.street = this.teacherFormModel.controls.street.value;
            teacher.streetNumber = this.teacherFormModel.controls.streetNumber.value;
            teacher.byography = this.teacherFormModel.controls.byography.value;
            teacher.language = Boolean(parseInt(this.teacherFormModel.controls.languageNumber.value, 0));
            if (this.img) {
                teacher.image = this.croppedImagepath;
            }
            this.eseguiModifica(teacher);
        }
    }

    /**
     * gli passo un oggetto user di tipo Student o Teacher in base al ruolo nella funzione salvaModifica
     * i dati presi precedentemente e salvati nell'oggetto student o teacher li passo al server utilizzando la funzione
     * editProfiloStudent / editprofiloTeacher
     * a questa funzione gli passo l'oggetto e la Vecchia Password (che viene utilizzata come controllo per abilitare la modifica)
     * se il campo della Nuova password è stato riempito allora l'utente viete sloggato e rimandato sulla Login
     * altrimenti viene chiamata la funzione Login dove gli passo l'email e la Vecchia password per l'autenticazione
     * (siccome è un observable devo utilizzare il substribe per farmi ritornare qualcosa)
     * con HttpErrorResponse catturo l'errore e gli faccio apparire un allert sullo schermo dove gli comunico che ha sbagliato password
     * @param user oggetto da inviare
     */
    eseguiModifica(user: Student | Teacher) {
        if (user.roles === 1) {
            // tslint:disable-next-line:max-line-length
            this.userService.editProfiloStudent(user as Student, this.studentFormModel.controls.passwordVecchia.value).subscribe(() => {
                this.userService.logout();
                this.navController.navigateRoot('login');
               }, (err: HttpErrorResponse) => {
                console.log(err);
                if (err.status === 401) {
                    console.error('login request error: ' + err.status);
                    this.showPasswordError();
                    this.studentFormModel.controls.passwordVecchia.reset();
                }
                if (err.status === 500) {
                    console.error('login request error: ' + err.status);
                    this.showPasswordError();
                }
            });
        } else {
            // tslint:disable-next-line:max-line-length
            this.userService.editProfiloTeacher(user as Teacher, this.teacherFormModel.controls.passwordVecchia.value).subscribe(() => {
                this.userService.logout();
                this.navController.navigateRoot('login');
            }, (err: HttpErrorResponse) => {
                console.log(err);
                if (err.status === 401) {
                    console.error('login request error: ' + err.status);
                    this.showPasswordError();
                    this.teacherFormModel.controls.passwordVecchia.reset();
                }
                if (err.status === 500) {
                    console.error('login request error: ' + err.status);
                    this.showPasswordError();
                }
            });
        }
    }

    /**
     * Funzione per la validazione della Nuova password
     */
    public setPwdValidator() {
        if (this.utente$.value.roles === 1) {
            this.studentFormModel.controls.password.setValidators(Validators.compose([
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])
            );
        } else {
            this.teacherFormModel.controls.password.setValidators(Validators.compose([
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])
            );
        }
    }

    /**
     * Allert che viene chiamato quando l'utente immette la password sbagliata
     */
    async showPasswordError() {
        const alert = await this.alertController.create({
            header: this.errorTitle,
            message: this.pwdMessageError,
            buttons: ['OK']
        });
        await alert.present();
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
        }, () => {
            // Handle error
        });
    }

    async selectImage() {
        const actionSheet = await this.actionSheetController.create({
            header: this.imageSourceHeader,
            buttons: [{
                text: this.loadLibraryText,
                handler: () => {
                    this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
                {
                    text: this.useCameraText,
                    handler: () => {
                        this.pickImage(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: this.cancelButton,
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    cropImage(fileUrl) {
        this.crop.crop(fileUrl, {quality: 100, targetWidth: -1, targetHeight: -1})
            .then(
                newPath => {
                    this.showCroppedImage(newPath.split('?')[0]);
                },
                error => {
                    alert(this.imageCroppingError + error);
                }
            );
    }

    showCroppedImage(ImagePath) {
        this.isLoading = true;
        const splitPath = ImagePath.split('/');
        const imageName = splitPath[splitPath.length - 1];
        const filePath = ImagePath.split(imageName)[0];
        this.file.readAsDataURL(filePath, imageName).then(base64 => {
            this.croppedImagepath = base64;
            this.isLoading = false;
            this.img = true;
        }, error => {
            alert(this.imageShowingError + error);
            this.isLoading = false;
        });
    }

    /**
     * Funzione che re-inizializza la traduzione
     */
    changeTranslate() {
        this.linguaService.getLinguaAttuale().subscribe((lingua: string) => {
            this.translate.setDefaultLang(lingua);
            this.navController.navigateRoot('/');
        });
    }

    /**
     * Funione per le traduzioni
     */
    initTranslate() {
        this.translateService.get('IMAGE_SOURCE_HEADER').subscribe((data) => {
            this.imageSourceHeader = data;
        });
        this.translateService.get('LOAD_LIBRARY_TEXT').subscribe((data) => {
            this.loadLibraryText = data;
        });
        this.translateService.get('USE_CAMERA_TEXT').subscribe((data) => {
            this.useCameraText = data;
        });
        this.translateService.get('CANCEL_BUTTON').subscribe((data) => {
            this.cancelButton = data;
        });
        this.translateService.get('IMAGE_CROPPING_ERROR').subscribe((data) => {
            this.imageCroppingError = data;
        });
        this.translateService.get('IMAGE_SHOWING_ERROR').subscribe((data) => {
            this.imageShowingError = data;
        });
        this.translateService.get('ERROR').subscribe((data) => {
            this.errorTitle = data;
        });
        this.translateService.get('ERROR_PASSWORD').subscribe((data) => {
            this.pwdMessageError = data;
        });
        //
        this.translateService.get('EMAIL_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.email[0].message = data;
        });
        this.translateService.get('EMAIL_MIN_LENGTH_MESSAGE').subscribe((data) => {
            this.validationMessages.email[1].message = data;
        });
        this.translateService.get('EMAIL_PATTERN_MESSAGE').subscribe((data) => {
            this.validationMessages.email[2].message = data;
        });
        this.translateService.get('EMAIL_VALID_EMAIL_MESSAGE').subscribe((data) => {
            this.validationMessages.email[3].message = data;
        });
        this.translateService.get('PASSWORD_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.password[0].message = data;
        });
        this.translateService.get('NAME_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.name[0].message = data;
        });
        this.translateService.get('SURNAME_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.surname[0].message = data;
        });
        this.translateService.get('BIRTHDAY_REQUIRED_MESSAGE').subscribe((data) => {
            this.validationMessages.birthday[0].message = data;
        });
        this.translateService.get('BIRTHDAY_VALID_AGE_MESSAGE').subscribe((data) => {
            this.validationMessages.birthday[1].message = data;
        });
    }
}
