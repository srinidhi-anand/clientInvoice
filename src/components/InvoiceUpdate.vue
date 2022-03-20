<script>
import http from "../../src/httpcall";  
import 'vue-datepicker-ui/lib/vuedatepickerui.css';
import VueDatepickerUi from 'vue-datepicker-ui';

export default{
    name: 'InvoiceUpdate',
    components: {
      Datepicker: VueDatepickerUi,
    },
    created () {
        this.initialcall(this.$route.params.id)
    },
    methods: {
        addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        },
        async initialcall(id){
            this.invoiceid = id;
            console.log(id);
            try {
                await http.get("/invoices/"+id+"/")
                .then(response => { this.invoicejson = response.data;  
                                    console.log(response.data);  
                                })  
                .catch(e => { console.log(e);  }); 
            } catch (error) {
                console.log(error);
            }
            
            console.log(`invoices222`, this.invoicejson);
            this.form= this.invoicejson;
            this.invoice_productslist = JSON.parse(this.form['line_items']);
            this.invoice_subtotal = this.form['subtotal'];
            this.invoice_total = this.form['total'];
            this.taxval = this.form['taxtotal'];
            this.newtodayDate= new Date(this.form['date']);
            this.newduedate= new Date(this.form['due_date']);
        },
        onFocus: function(event) {
            event.target.className = 'form-yellow-bg'
            console.log( event,`classname`, new Date().toJSON().slice(0,10));
        },
        onBlur: function() {
            event.target.className = '';
        },
        onFocusIn: function(event) {
            event.target.id = 'form-yellow-bg'
            console.log( event,`classname`);
        },
        onFocusOut: function() {
            event.target.id = '';
        },
        addrow: function(){
            console.log("new row clicked");
            this.invoice_productslist.push(
                {
                    "item_id": Math.floor(Math.random() * 1000000000),
                    "name": "",
                    "product_type": "",
                    "rate": '',
                    "quantity": '',
                    "item_total": ''
                }
            )
        },
        goToHome(){
             this.$router.push({name: 'home'}) 
        },
        async postdata() {
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.form)
            };
            console.log(requestOptions);
            try {
                fetch("http://sri143.pythonanywhere.com/api/invoices/"+this.invoiceid+"/", requestOptions)
                    .then(response => response.json());
            } catch (error) {
                console.log(error);
            }
            console.log(`inputjson`, this.inputjson);
        },
        saveInvoice() {
            console.log(this.form, 'clicked ',this.inputjson,' save', this.invoice_productslist);
            if(this.invoice_productslist.length > 0){
                this.form['line_items'] = JSON.stringify(this.invoice_productslist);
            }
            this.form['date'] = String(this.addDays(new Date(this.newtodayDate), 1).toJSON().slice(0,10));
            this.form['due_date'] = String(this.addDays(new Date(this.newduedate), 1).toJSON().slice(0,10));
            console.log( Object.keys(this.form), this.form['salesperson_company'] , this.form['customer_name'], (Object.keys(this.form).length > 0 &&  Object.keys(this.form).includes('salesperson_company') && Object.keys(this.form).includes('customer_name') && this.form['salesperson_company'] != '' && this.form['customer_name'] != ''));
            if(Object.keys(this.form).length > 0 &&  Object.keys(this.form).includes('salesperson_company') && Object.keys(this.form).includes('customer_name') && this.form['salesperson_company'] != '' && this.form['customer_name'] != ''){
                console.log(`if save ---`, this.form);
                this.postdata(this.form);
                this.$router.push({name: 'home'}) ;
                this.msgflag="hide";
                this.form ={}
            }else{
                console.log(`else save ---`);
                this.msgflag = "show";
            }
            console.log(this.msgflag);
        },
        calculateTotal() {
            var subtotal, total;
            console.log('eee', this.invoice_productslist);
            subtotal = this.invoice_productslist.reduce(function (sum, product) {
                var lineTotal = parseFloat(product.item_total);
                if (!isNaN(lineTotal)) {
                    return sum + lineTotal;
                }
            }, 0);
            console.log('eeeww', subtotal);
            this.invoice_subtotal = subtotal.toFixed(2);
            this.form['subtotal'] = this.invoice_subtotal;
            this.taxval = parseFloat(subtotal * (this.invoice_tax / 100)).toFixed(2);
            this.form['taxtotal'] = this.taxval;
            total = (subtotal * (this.invoice_tax / 100)) + subtotal;
            console.log('eeewssw', total);
            total = parseFloat(total);
            console.log('eeewwwww', total);
            if (!isNaN(total)) {
                this.invoice_total = total.toFixed(2);
            } else {
                this.invoice_total = '0.00'
            }
            this.form['total'] = this.invoice_total;
        },
        calculateLineTotal(invoice_product) {
            console.log(invoice_product);
            var total = parseFloat(invoice_product.rate) * parseFloat(invoice_product.quantity);
            if (!isNaN(total)) {
                invoice_product.item_total = total.toFixed(2);
            }
            this.calculateTotal();
        },
        deleteRow(index, invoice_product) {
            var idx = this.invoice_productslist.indexOf(invoice_product);
            console.log(idx, index);
            if (idx > -1) {
                this.invoice_productslist.splice(idx, 1);
            }
            this.calculateTotal();
        },
    },
    data(){

        return{
            invoicejson: {},
            invoice_productslist:[
                {
                    "item_id": Math.floor(Math.random() * 1000000000),
                    "name": "",
                    "product_type": "",
                    "rate": '',
                    "quantity": '',
                    "item_total": ''
                }
            ],
            invoiceid: '',
            msgflag:"hide",
            inputjson :{},
            form :{},
            invoice_subtotal: 0.00,
            invoice_tax: 10,
            taxval:0.00,
            newtodayDate : new Date(),
            newduedate: new Date(),
            inputfields : [
                {'text': 'Your Company Name', 'name': 'salesperson_company', 'disabled':'readonly'},
                {'text': 'Your Name', 'name': 'salesperson_name', 'disabled':'readonly'}, 
                {'text': "Company's Address",  'name': 'salesperson_address', 'disabled':'readonly'},
                {'text': 'City, State, Zip',  'name': 'salesperson_city_state', 'disabled':'readonly'},
                {'text': 'Country', 'name': 'salesperson_cntry', 'disabled':'readonly'},
            ],
            shiptodetails: [            
                {'text': 'Bill To', 'name': 'bill_to', 'disabled':'readonly'},
                {'text': "Your Client's Company", 'name': 'customer_name', 'disabled':'readonly'}, 
                {'text': "Client's Address",  'name': 'customer_address', 'disabled':''},
                {'text': 'City, State, Zip',  'name': 'customer_city_state', 'disabled':''},
                {'text': 'Country', 'name': 'customer_cntry', 'disabled':''},
            ],
            billdetails: [ 
                {'text':'Invoice#', 'type': 'text', 'value':'INV-12','name':'invoice_number', 'disabled':'readonly'},
                {'text':'Invoice Date', 'type': 'date', 'value':'', 'name':'date', 'disabled':'readonly'},
                {'text':'Due Date', 'type': 'date', 'value':'', 'name':'due_date', 'disabled':''},
            ],
            thlist: [
                {'text':'Item Description', 'width':'40%', 'align':'left'},
                {'text':'Qty', 'width':'20%', 'align':'right'},
                {'text':'Rate','width':'30%', 'align':'right'},
                {'text':'Amount','width':'30%', 'align':'right'}
            ],
            footnotes: [
                {'header':'Notes', 'text': 'It was great doing business with you.', 'name':'notes', 'disabled':'readonly'},
                {'header':'Terms & Conditions', 'text': 'Please make the payment by the due date.', 'name':'terms', 'disabled':'readonly'}
            ],
        }
    }
}

</script>

<template>
    <div class="row btn-head">
        <div class="head-div">
            <button class="rgt-aln clr" @click="saveInvoice"><img alt="save logo" class="action-icon" src="../../src/assets/save.svg"> Save </button>
            <button class="rgt-aln btn-clr action" @click="goToHome()"> CANCEL </button>
        </div>
    </div>
    <div class="page-div">
        
        <div  class="row page-alert" :id="$data[`msgflag`]">
            Please fill the required Bill to / Ship to fields to save.
        </div>
        <div class="row">
            <div class="col-md-7 ship-dtl">
                <template v-for="(field, k) in inputfields" :key="k">
                    <input id="shp-field"  :name="field.name" class="" :readonly="field.disabled" type="text" v-model="form[field.name]" :placeholder="field.text"  />
                </template>
            </div>

            <div class="col-md-4 title">
                INVOICE
            </div>
        </div>
        <div class="row"> <!-- @change="inputval($event)" -->
            <div class="col-md-7 ship-dtl">
                <template v-for="(field, k) in shiptodetails" :key="k">
                    <template v-if="field.disabled == 'readonly'">
                        <template v-if="field.name== 'bill_to'">
                            <input  id="shp-field" type="text" class="" :readonly="field.disabled" :name="field.name" :value="field.text"  />
                        </template>
                        <template v-else>
                            <input  id="shp-field" type="text" class="" :readonly="field.disabled" :name="field.name" v-model="form[field.name]" :placeholder="field.text"  />
                        </template>
                    </template>
                    <template v-else>
                        <input id="shp-field" type="text" class=""  @focus="onFocus($event)" @blur="onBlur" :name="field.name" v-model="form[field.name]" :placeholder="field.text"  />
                    </template>
                </template>
            </div>

            <div class="col-md-4 billdetails">
                <template v-for="(field, k) in billdetails" :key="k">
                    <div class="row">
                    <div class= "col-md-5 lft-aln">
                        <input class="form-control-read" :id="field.text" type="text"  :value="field.text" readonly />
                    </div><div class= "col-md-6 rgt-aln">
                        <template  v-if=" field.type == 'date'">
                            <template  v-if=" field.name == 'date'">
                                <Datepicker lang="en-in" v-model="newtodayDate" class="form-control-inp invoice_date" disabled="true" :name="field.name" :id="field.text" />
                            </template>

                            <template  v-else>
                                <Datepicker lang="en-in"  v-model="newduedate" class="form-control-inp due_date" :name="field.name" :id="field.text" />
                            </template>
                            
                            
                        </template>
                        <template v-else>                            
                           <input class="form-control-inp" :name="field.name" :id="field.text"  :type="field.type" v-model="form[field.name]" :readonly="field.disabled"  />
                        </template>
                        <!--<input class="form-control-inp" :id="field.text" @focus="onFocusIn($event)" @blur="onFocusOut" :type="field.type" v-model="form[field.name]" :placeholder="field.text"  />-->
                    </div></div>
                </template>
            </div>
        </div>
        <div class="row">
            <table class="table table-bordered">
                <thead class="throw"><tr> 
                    <template v-for="thl in thlist" :key="thl.text">
                        <td :width="thl.width" :align="thl.align" class="thl"> {{thl.text}} </td>   
                    </template></tr> 
                </thead>
                <tbody class="tdrow"> 
                    <tr v-for="(invoice_product, k) in invoice_productslist" :key="k">
                        <td>
                            <textarea class="form-control" type="text" @focus="onFocusIn($event)" @blur="onFocusOut" v-model="invoice_product.name" />
                        </td>
                        <td>
                            <input class="form-control  text-right"  @focus="onFocusIn($event)" @blur="onFocusOut" type="number" min="0" step="1" v-model="invoice_product.quantity" @change="calculateLineTotal(invoice_product)" />
                        </td>
                        <td>
                            <input class="form-control text-right" @focus="onFocusIn($event)" @blur="onFocusOut" type="number" min="0" step=".01" v-model="invoice_product.rate" @change="calculateLineTotal(invoice_product)"  />
                        </td>
                        <td>
                            <input disabled class="form-control text-right" type="number" min="0" step=".01" v-model="invoice_product.item_total" />
                        </td>
                        <td class="trashIconContainer">
                            <i class="far fa-trash-alt" @click="deleteRow(k, invoice_product)">x</i>
                        </td>
                    </tr>

                    <div class="row hyperlink" v-on:click="addrow" ><i> + Add new Item </i> </div>
                    <tr> <td colspan="3" align="right"> Sub Total </td> <td align="right"> {{invoice_subtotal}} </td> </tr>
                    <tr><td colspan="3" align="right"> Sales Tax (10%) </td> <td align="right"> {{taxval}}</td>  </tr>
                    <tr class="sumval"><td colspan="3" align="right"> TOTAL </td> <td align="right"> {{invoice_total}} </td>  </tr>
                </tbody>
            </table>
        </div>
        <div class="row footer-inp">
            <template v-for="content in footnotes" :key="content.header">
                <div class="row">
                    <div class="col-md-12 terms"> {{content.header}} </div>
                    <textarea class="col-md-12 note" :name="content.text" v-model="form[content.name]" id="" :readonly="content.disabled"   />
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
@import '../../src/assets/stylesheet2.css'

</style>