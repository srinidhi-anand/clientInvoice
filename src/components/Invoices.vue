<script>
import 'vue-datepicker-ui/lib/vuedatepickerui.css';
import VueDatepickerUi from 'vue-datepicker-ui';
//import VCalendar from 'v-calendar';

export default{
    name: 'InvoiceCreate',
    components: {
      Datepicker: VueDatepickerUi,
      //vdatepicker: VCalendar,
    },
    methods: {
        datepicker: function() {
            console.log( this.newtodayDate ,`cccc` , this.newduedate);
            this.newtodayDate = new Date(this.newtodayDate);
            this.newduedate = new Date(this.newduedate);
            //this.newtodayDate = new Date(this.newtodayDate).toJSON().slice(0,10).toString(),
            //this.newduedate = new Date(this.newduedate).toJSON().slice(0,10).toString(),
            console.log( this.newtodayDate ,`cccc` , this.newduedate);
        },
        onFocus: function(event) {
            event.target.className = 'form-yellow-bg'
            console.log( event,`classname`, new Date().toJSON().slice(0,10));
        },
        onBlur: function(event) {
            event.target.className = '';
        },
        onFocusIn: function(event) {
            event.target.id = 'form-yellow-bg'
            console.log( event,`dd`);
            if(event.target.name == 'date' || event.target.name == 'due_date'){
                //event.target.type = 'date';
                console.log( event.target.value,`hhhh`);
                if (event.target.value == '' ){
                    console.log( this.newtodayDate,`333333333`);
                    //event.target.value = this.newtodayDate;
                }
            }
        },
        onFocusOut: function(event) {
            event.target.id = '';
            console.log( event,`ffff`);
            if(event.target.name == 'date' || event.target.name == 'due_date'){
                //event.target.type = 'text';
                 console.log( event.target.value,`gggg`);
                if (event.target.value == '' ){
                    console.log( this.todayDate,`444444444444`);
                    //event.target.value = this.todayDate;
                }
            }
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
            //this.form = {customer_address: "Madurai", customer_city_state: "Tamil Nadu", customer_cntry: "India", customer_name: "ABC & Co", date: "2022-03-18", due_date: "2022-04-02", invoice_id: "310651630", invoice_number: "INV-0009", line_items: "[{\"item_id\":570973671,\"name\":\"AXC design\",\"product_type\":\"\",\"rate\":5465,\"quantity\":3,\"item_total\":\"16395.00\"},{\"item_id\":493208235,\"name\":\"Brochure\",\"product_type\":\"\",\"rate\":3434,\"quantity\":3,\"item_total\":\"10302.00\"}]", notes: "Thanks for the great business.", salesperson_address: "Kotivakkam", salesperson_city_state: "Chennai, Tamil Nadu", salesperson_cntry: "India", salesperson_company: "Bowman & Co", salesperson_name: "Abinay", status: "draft", subtotal: "26697.00", taxtotal: "2669.70", terms: "Please make sure of payments by the Due date.", total: "29366.70"}
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.form)
            };
            console.log(requestOptions);
            try {
                fetch("http://localhost:8000/api/invoices/", requestOptions)
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
            this.form['invoice_id'] = Math.floor(Math.random() * 1000000000);
            this.form['status']='draft';
            //this.postdata(this.form);
            console.log( Object.keys(this.form), this.form['salesperson_company'] , this.form['customer_name'], (Object.keys(this.form).length > 0 &&  Object.keys(this.form).includes('salesperson_company') && Object.keys(this.form).includes('customer_name') && this.form['salesperson_company'] != '' && this.form['customer_name'] != ''));
            if(Object.keys(this.form).length > 0 &&  Object.keys(this.form).includes('salesperson_company') && Object.keys(this.form).includes('customer_name') && this.form['salesperson_company'] != '' && this.form['customer_name'] != ''){
                console.log(`if save ---`);
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
            msgflag:"hide",
            inputjson :{},
            invoice_subtotal: 0.00,
            invoice_tax: 10,
            taxval:0.00,
            invoice_total:0.00,
            // todayDate: new Date().toJSON().slice(0,10).split('-').reverse().join('-').toString(),
            newtodayDate : new Date(),
            newduedate: new Date(),
            //formatted_date: new Date().toJSON().slice(0,10).split('-')[2]+'-'+new Date().toJSON().slice(0,10).split('-')[1]+'-'+new Date().toJSON().slice(0,10).split('-')[0],
            form : {'date' : this.newtodayDate, 'due_date' :this.newduedate},
            inputfields : [
                {'text': 'Your Company Name', 'name': 'salesperson_company'},
                {'text': 'Your Name', 'name': 'salesperson_name'}, 
                {'text': "Company's Address",  'name': 'salesperson_address'},
                {'text': 'City, State, Zip',  'name': 'salesperson_city_state'},
                {'text': 'Country', 'name': 'salesperson_cntry'},
            ],
            shiptodetails: [            
                {'text': 'Bill To', 'name': 'bill_to'},
                {'text': "Your Client's Company", 'name': 'customer_name'}, 
                {'text': "Client's Address",  'name': 'customer_address'},
                {'text': 'City, State, Zip',  'name': 'customer_city_state'},
                {'text': 'Country', 'name': 'customer_cntry'},
            ],
            billdetails: [ 
                {'text':'Invoice#', 'type': 'text', 'value':'INV-0000','name':'invoice_number'},
                {'text':'Invoice Date', 'type': 'date', 'value':'newtodayDate', 'name':'date'},
                {'text':'Due Date', 'type': 'date', 'value':'newduedate', 'name':'due_date'},
            ],
            thlist: [
                {'text':'Item Description', 'width':'40%', 'align':'left'},
                {'text':'Qty', 'width':'20%', 'align':'right'},
                {'text':'Rate','width':'30%', 'align':'right'},
                {'text':'Amount','width':'30%', 'align':'right'}
            ],
            footnotes: [
                {'header':'Notes', 'text': 'It was great doing business with you.', 'name':'notes'},
                {'header':'Terms & Conditions', 'text': 'Please make the payment by the due date.', 'name':'terms'}
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
                    <input id="shp-field"  :name="field.name" class="" @focus="onFocus($event)" @blur="onBlur" type="text" v-model="form[field.name]" :placeholder="field.text"  />
                </template>
            </div>

            <div class="col-md-4 title">
                INVOICE
            </div>
        </div>
        <div class="row"> <!-- @change="inputval($event)" -->
            <div class="col-md-7 ship-dtl">
                <template v-for="(field, k) in shiptodetails" :key="k">
                    <input id="shp-field" type="text" class=""  @focus="onFocus($event)" @blur="onBlur" :name="field.name" v-model="form[field.name]" :placeholder="field.text"  />
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
                                <Datepicker lang="en-in"  @change="datepicker" v-model="newtodayDate" class="form-control-inp" :placeholder="new Date().toJSON().slice(0,10)" :name="field.name" :id="field.text" />
                                <pre> {{newtodayDate}} </pre>
                            </template>

                            <template  v-if=" field.name == 'due_date'">
                                <Datepicker @change="datepicker" lang="en"   v-model="newduedate" class="form-control-inp" :name="field.name" :id="field.text" :placeholder="new Date().toJSON().slice(0,10)" />
                                <pre> {{newduedate}} </pre>
                            </template>
                            
                            
                        </template>
                        <template v-else>                            
                           <input class="form-control-inp" :name="field.name" :id="field.text" @focus="onFocusIn($event)" @blur="onFocusOut" :type="field.type" v-model="form[field.name]" :placeholder="field.value"  />
                        </template>
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
                    <textarea class="col-md-12 note" :name="content.text" v-model="form[content.name]" id="" @focus="onFocusIn($event)" @blur="onFocusOut"   />
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
@import '../../src/assets/stylesheet.css'

</style>