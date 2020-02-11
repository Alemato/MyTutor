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
import {ActionSheetController, AlertController} from '@ionic/angular';
import {File} from '@ionic-native/file/ngx';
import {sha512} from 'js-sha512';

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
    private errorSubTitle: string;
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
                private file: File) {
    }

    ngOnInit() {
        this.utente$ = this.userService.getUser();
        this.initTranslate();
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
        this.findInvalidControls();
    }

    public findInvalidControls() {
        const invalid = [];
        const controls = this.studentFormModel.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid;
    }

    initFormStudent(student: Student) {
        this.studentFormModel = this.formBuilder.group({
            // le cose che scrivo dentro [] le ritrovo sulla page registrazione.html
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

    setValuesFormStudent(student: Student) {
        this.studentFormModel.controls.name.setValue(student.name);
        this.studentFormModel.controls.surname.setValue(student.surname);
        this.studentFormModel.controls.passwordVecchia.setValue('');
        this.studentFormModel.controls.password.setValue('');
        this.studentFormModel.controls.birthday.setValue(new Date(student.birthday).toISOString());
        this.studentFormModel.controls.studyGrade.setValue(student.studyGrade);
        this.studentFormModel.controls.languageNumber.setValue((+student.language).toString());
    }

    initFormTeacher(teacher: Teacher) {
        this.teacherFormModel = this.formBuilder.group({
            // le cose che scrivo dentro [] le ritrovo sulla page registrazione.html
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

    setValuesFormTeacher(teacher: Teacher) {
        this.teacherFormModel.controls.name.setValue(teacher.name);
        this.teacherFormModel.controls.surname.setValue(teacher.surname);
        this.teacherFormModel.controls.passwordVecchia.setValue('');
        this.teacherFormModel.controls.password.setValue('');
        this.teacherFormModel.controls.birthday.setValue(new Date(teacher.birthday).toISOString());
        this.teacherFormModel.controls.studyGrade.setValue(teacher.region);
        this.teacherFormModel.controls.studyGrade.setValue(teacher.region);
        this.teacherFormModel.controls.studyGrade.setValue(teacher.city);
        this.teacherFormModel.controls.studyGrade.setValue(teacher.postCode);
        this.teacherFormModel.controls.studyGrade.setValue(teacher.street);
        this.teacherFormModel.controls.studyGrade.setValue(teacher.streetNumber);
        this.teacherFormModel.controls.studyGrade.setValue(teacher.byography);
        this.teacherFormModel.controls.languageNumber.setValue((+teacher.language).toString());
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

    salvaModifica() {
        if (this.utente$.value.roles === 1) {
            let student: Student = new Student();
            student = this.utente$.getValue();
            student.password = sha512(this.studentFormModel.controls.passwordVecchia.value).toUpperCase();
            console.log(student);
        }
    }

    public setPwdValidator() {
        if (this.utente$.value.roles === 1) {
            this.studentFormModel.controls.password.setValidators(Validators.compose([
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])
            );
        } else {
            this.studentFormModel.controls.password.setValidators(Validators.compose([
                Validators.minLength(5),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])
            );
        }
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
