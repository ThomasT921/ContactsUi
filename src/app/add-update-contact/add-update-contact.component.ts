import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from '../Models/contact';
import { StateViewModel } from '../Models/state';

@Component({
  selector: 'app-add-update-contact',
  templateUrl: './add-update-contact.component.html',
  styleUrls: ['./add-update-contact.component.css']
})
export class AddUpdateContactComponent implements OnInit {
public contactForm: FormGroup;
@Input() states: StateViewModel[]=[]
@Input() freqs: string[]=[]
@Input() scope: string;
@Input() contact: Contact
  constructor(private form: FormBuilder,
    private activeModal: NgbActiveModal,
    public popOver: PopOverService) { 
    this.contactForm = this.form.group({
      id:[0],
      firstName: ['', {validators: [Validators.required, Validators.maxLength(20)]}],
      lastName:['', {validators: [Validators.required, Validators.maxLength(20)]}],
      phone: [''],
      email: ['', {validators: [Validators.required, Validators.email], updateOn: 'blur'}],
      city: ['', {validators: [Validators.required, Validators.maxLength(50)]}],
      state: ['', {validators: [Validators.required]}],
      zip: ['', {validators: [Validators.required]}],
      street: ['', {validators: [Validators.required, Validators.maxLength(100)]}],
      contactFreq: ['', {validators: [Validators.required]}],
    })
  }

  ngOnInit(): void {
    if(this.scope == 'Update' ){
      this.contactForm.patchValue(this.contact)
      this.contactForm.patchValue({state: this.states.find(x => x.abv == this.contact.state).name})
    }
  }

  save(){
    if(this.popOver.CheckValidity(this.contactForm.controls, 'Contact Form:')){
    var x = new Contact();
    x = this.contactForm.value;
    var state = this.states.find(c => c.name == x.state).abv;
    x.state = state;
    this.activeModal.close(x);
    }
  }

  close(){
    this.activeModal.dismiss();
  }  

}

@Injectable({
  providedIn: 'root'
})
export class PopOverService {
  displayPopOver(errors: any, context: any){
      if(errors){
        context.open()
      }
      if(!errors){
        if(context.isOpen()){
          context.close()
        }
      }
    }

  displayPopOverMsg (controlName: any, form: any, message?: string){
      var errorMessage = '';
      if(form.get(controlName).hasError('required')){
        errorMessage = 'This field is required.';
      }
      else if(form.get(controlName).hasError('maxlength')){
        errorMessage = 'You have exceeded the maximum length.';
      }
      else if(form.get(controlName).hasError('pattern')){
        errorMessage = 'Input format invalid.';
      }
      else if(form.get(controlName).hasError('dateInvalid')){
        errorMessage = 'Date Format Invalid.';
      }
      else if(form.get(controlName).hasError('max')){
        errorMessage = 'This field must be empty.';
      }
      else if(form.get(controlName).hasError('dateRangeInvalid')){
        errorMessage = 'This date must be after the start date.';
      }
      else if(form.get(controlName).hasError('email')){
        errorMessage = 'Invalid Email.';
      }
      if(message != undefined){
        errorMessage = message
      }
      return errorMessage;
      
    }

  CheckValidity(formControls: any, componentName: string){
    var errorString = ''
    var keys = Object.keys(formControls)
    keys.forEach(key => {
      if(formControls[key].invalid){
        errorString += key + ': ' + Object.keys(formControls[key].errors)[0] + "\n"
      }
    });
    if(errorString != ''){
      window.alert(errorString);
      return false;
    }
    return true;
  }
}
