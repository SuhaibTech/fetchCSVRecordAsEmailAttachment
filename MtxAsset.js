import { LightningElement, wire ,track} from 'lwc';
import getRecords from '@salesforce/apex/mxtAssetGetRecords.getRecords';
import generateCSV from '@salesforce/apex/mxtAssetGetRecords.generateCSV';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class MtxAsset extends LightningElement {




    query = '';
    fieldList = [];
    @track columns = {};
    emailId;
    records = [];
    columns =[];
    hasError = false;
    fetchQuery(event){
        this.query = event.detail.value;
        //console.log('---------------'+this.query);
    }


    fetchEmailId(event){
        this.emailId = event.detail.value;
    }
    handleGetRecords() {
        getRecords({query:this.query})
            .then(result => {
                this.records = result;
                console.log('----fetched recods -----'+JSON.stringify(this.records));
            })
            .catch(error => {
                console.error('----fetchRecord fucntion errror -----'+error);
            });
    }


    getColumns() {
        let columns = [];
        this.fieldList.forEach(field => {
            columns.push({ label: field, fieldName: field });
        });
        return columns;
    }


    resetData(){
        this.emailId ='';
        this.query = '';
    }


    handleDownloadCsv(){
        console.log('----csv record called---'+this.query);
        console.log('-----email---'+this.emailId);
        generateCSV({query:this.query , emailId:this.emailId})
        .then((result) => {
            this.fieldList = result;
            // this.fieldList.forEach(element => {
            //     this.columns.push({
            //         label :element , fieldName:element
            //     })
            // });
            this.columns = this.getColumns();
            console.log('----columns----'+JSON.stringify(this.columns));
            this.error = undefined;
            this.hasError = false;
           console.log('**************entered then');
            const event = new ShowToastEvent({
                title: 'Success!',
                message: 'Your CSV file is shared',
                variant: 'success',
                mode: 'pester'
            });
            this.dispatchEvent(event);
        })
        .catch((error) => {
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'An Occur Occured',
                variant: 'Error',
                mode: 'pester'
            });
            this.dispatchEvent(event);
            this.error = JSON.stringify(error);
            console.log('**************error****'+this.error);


            this.fieldList = undefined;
            this.hasError = true;
        })
        .finally(err =>{
            this.resetData();
        });
    }
}
