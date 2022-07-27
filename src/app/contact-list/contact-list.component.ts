import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'src/environments/environment';
import { AddUpdateContactComponent } from '../add-update-contact/add-update-contact.component';
import { Contact, ContactInfoViewModel } from '../Models/contact';
import { StateViewModel } from '../Models/state';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
public contacts: Contact[];
public contact: Contact;
public states: StateViewModel[];
public freqs: string[];
public columnDefs: ColDef[] = [
  { field: 'id', headerName: 'Id' },
  {field: 'firstName'},
  {field: 'lastName'},
  {field: 'city'},
  {field: 'state'},
  {field: 'phone',headerName: 'Phone Number'}

];
public selectedRows: Number = 0;
public gridOptions: GridOptions;
@ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  constructor(private http: HttpClient, private modalService: NgbModal) { }
  private url = environment.apiUrl ;
  private headers = new HttpHeaders({
    'content-type': 'application/json',
    accept: 'application/json'
 });

  async ngOnInit(): Promise<any> {
    //this.contacts = await this.http.get(this.url + '/getcontacts',{headers: this.headers}).toPromise() as Contact[]
  }

  async fetchData(){
    var results = await this.http.get(this.url + '/getcontacts',{headers: this.headers}).toPromise() as ContactInfoViewModel;
    this.contacts = results.items;
    this.states = results.states;
    this.freqs = results.freqStrings
  }

  async onGridReady(params: GridReadyEvent) {
    await this.fetchData();
    params.api.setColumnDefs(this.columnDefs);
    params.api.setRowData(this.contacts)
    this.selectedRows = this.agGrid.api.getSelectedRows().length;
  }

  onCellClicked( e: CellClickedEvent): void {
    this.selectedRows = this.agGrid.api.getSelectedRows().length;
  }
 
  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }
  async Add(){
    this.contact = undefined;
    var modal = this.modalService.open(AddUpdateContactComponent, {
      centered: true,
      size:'xl'
    })

    modal.componentInstance.contact = null;
    modal.componentInstance.scope = 'New'
    modal.componentInstance.states = this.states
    await modal.result.then((result) => {
      this.contact = result;
    }, (reason)=> {});
    if(this.contact != undefined){
      var response = await this.http.post(this.url + '/getcontacts', this.contact, {headers: this.headers, observe: 'response'}).toPromise();
      if(response.status == 200){
        window.alert('Contact Updated')
      }
      if(response.status == 400){
        window.alert('Invalid Contact')
      }
      await this.fetchData()
    }
  }
  async Update(){
    this.contact = undefined;
    var modal = this.modalService.open(AddUpdateContactComponent, {
      centered: true,
      size:'xl'
    })
    var id = this.agGrid.api.getSelectedRows()[0].id
   modal.componentInstance.contact = this.contacts.find(x => x.id == id);
   modal.componentInstance.scope = 'Update'
   modal.componentInstance.states = this.states
   modal.componentInstance.freqs = this.freqs
   await modal.result.then((result) => {
    this.contact = result;
  }, (reason)=> {});
  if(this.contact != undefined){
    var response = await this.http.post(this.url + '/getcontacts/' + id, this.contact, {headers: this.headers, observe: 'response'}).toPromise();
    
    if(response.status == 200){
      window.alert('Contact Updated')
    }
    if(response.status == 400){
      window.alert('Invalid Contact')
    }
    await this.fetchData()
  }
  }

  async Delete(){
    var id = this.agGrid.api.getSelectedRows()[0].id;
    await this.http.delete(this.url + '/getcontacts/' + id,{headers: this.headers})
    await this.fetchData();
  }

}
