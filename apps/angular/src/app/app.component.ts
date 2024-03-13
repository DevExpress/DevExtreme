/* tslint:disable:component-selector */

import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  Orange,
  OrangeService
} from './orange.service';
import {
  Customer,
  CustomerService
} from './customer.service';
import {
  AppointmentService
} from './appointment.service';
import {
  OwnerService
} from './owner.service';
import {
  DxPopoverComponent
} from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';

@Component({
  selector: 'my-app',
  styles: [`
        h1, h2, h3 {
            font-family: 'Helvetica Neue','Segoe UI',Helvetica,Verdana,sans-serif;
        }
        .demo-container {
            width: 400px;
        }
        .demo-container > .dx-widget {
            margin-bottom: 20px;
            -display: block;
        }
        .float-right {
            float: right;
        }
        .full-width {
            width: 100%;
            display: block;
        }
        .scroll-view-height {
            height: 200px;
            display: block;
        }
        .resizable {
            display: block;
            background-color: #ccc;
        }
        .tab-content {
            text-align: justify;
            margin-top: 25px;
        }
        #tabs {
            margin-top: 60px;
        }
        .tabpanel-item {
            height: 200px;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            padding-left: 25px;
            padding-top: 55px;
            display: block;
        }
        .tabpanel-item  > div {
            float: left;
            padding: 0 85px 10px 10px
        }
        .tabpanel-item  p {
            font-size: 16px;
        }
        .form-group {
            margin-bottom: 10px;
        }
    `],
  templateUrl: 'app.component.html',
  providers: [
    OrangeService,
    CustomerService,
    AppointmentService,
    OwnerService
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(DxPopoverComponent) popover: DxPopoverComponent;
  
  value: Array<Date|Number|String> = [
    new Date(),
    new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
  ];
  selectionModes: string[] = ["single", "multiple", "range"];
  selectionMode = "multiple";

  text = 'Initial text';
  formData = { email: '', password: '' };
  emailControl: AbstractControl;
  passwordControl: AbstractControl;
  emailControlIsChanged = false;
  passwordControlIsChanged = false;
  form: FormGroup;
  boolValue: boolean;
  numberValue: number;
  dateValue: Date;
  currentDate: Date;
  demoItems: string[];
  popupVisible = false;
  chartSeriesTypes = ['bar', 'line', 'spline'];
  oranges: Orange[];
  customers: Customer[];
  appointments: ArrayStore;
  resources: any[];
  products = [
    {
      key: 'Notebook',
      items: ['Supernote JG867', 'Ultranote VP334', 'Meganote LS952']
    }, {
      key: 'Netbook',
      items: ['Supernet HY834', 'Ultranet KN354', 'Meganet ME830']
    }
  ];
  tabs = [
    {
      id: 0,
      text: 'user',
      icon: 'user',
      content: 'User tab content'
    }, {
      id: 1,
      text: 'comment',
      icon: 'comment',
      content: 'Comment tab content'
    }, {
      id: 2,
      text: 'find',
      icon: 'find',
      content: 'Find tab content'
    }
  ];
  chartItem: string;
  tabPanelItems: Customer[];
  tabContent: string;
  constructor(private orangeService: OrangeService,
    private customerService: CustomerService,
    private appointmentService: AppointmentService,
    private ownerService: OwnerService) {
    this.text = 'Text in textbox';
    this.boolValue = true;
    this.numberValue = 10;
    this.dateValue = new Date();
    this.currentDate = new Date(2015, 4, 25);
    this.demoItems = [
      'item1',
      'item2',
      'item3'
    ];
    this.tabContent = this.tabs[0].content;
  }
  helloWorld() {
    alert('Hello world');
  }
  buy(model) {
    alert(model + ' has been added to order');
  }
  callNumber(number) {
    alert(number + ' is being called...');
  }
  updateEmailControl(e) {
    this.form.controls['emailControl'].setValue(e.value);
  }
  updatePasswordControl(e) {
    this.form.controls['passwordControl'].setValue(e.value);
  }
  toggleFormControlsState(e) {
    if (e.value) {
      this.emailControl.disable();
      this.passwordControl.disable();
    } else {
      this.emailControl.enable();
      this.passwordControl.enable();
    }
  }
  onSubmit() {
    this.form.updateValueAndValidity();
    console.log('submitted');
    return false;
  }
  validate(params) {
    let result = params.validationGroup.validate();
    if (result.isValid) {
      alert('Form data is valid');
    } else {
      alert('Form data is invalid');
    }
  }
  ngOnInit() {
    this.form = new FormGroup({
      emailControl: new FormControl('', Validators.compose([Validators.required, CustomValidator.mailFormat])),
      passwordControl: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
    });
    this.emailControl = this.form.controls['emailControl'];
    this.passwordControl = this.form.controls['passwordControl'];
    this.oranges = this.orangeService.getOranges();
    this.customers = this.customerService.getCustomers();
    this.appointments = new ArrayStore({
      data: this.appointmentService.getAppointments(),
      key: 'ID'
    });
    this.resources = [{
      field: 'OwnerId',
      allowMultiple: true,
      dataSource: this.ownerService.getOwners(),
      label: 'Owner'
    }];
    this.tabPanelItems = this.customers.slice(0, 4);
  }
  ngAfterViewInit() {
    this.form.controls['emailControl'].valueChanges.subscribe((value) => {
      this.emailControlIsChanged = true;
      this.formData.email = value;
    });
    this.form.controls['passwordControl'].valueChanges.subscribe((value) => {
      this.passwordControlIsChanged = true;
      this.formData.password = value;
    });
  }
  showPopover() {
    this.popover.instance.show();
  }
  selectTab(e) {
    this.tabContent = this.tabs[e.itemIndex].content;
  }
  seriesHoverChanged(e) {
    this.chartItem = e.target.argument;
  }
}

export class CustomValidator {
  static mailFormat(control: FormControl) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (control.value && control.value.length && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return { 'incorrectMailFormat': true };
    }

    return null;
  }
}
