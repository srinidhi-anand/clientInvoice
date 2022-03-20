<template>
  <div class="col-md-12">
    <table class="table table-bordered">
      <thead class="throw">
        <tr> 
          <template v-for="thl in thlist" :key="thl">
                <td width="48%" class="th1"> {{thl}} </td>   
          </template>
        </tr> 
      </thead>
      <tbody>
        <template v-for="(invoice , k) in paginateItems"  :key="invoice">
            <tr :class="getclassname('trow',k)"> 
                <td width="48%" :class="getclassname('tdata',k)"> <a :href="getclassname('/update/',invoice.invoice_id)"> {{invoice.invoice_id}}</a> </td>  
                <td width="48%" :class="getclassname('tdata',k)"> {{invoice.customer_name}} </td>  
                <td width="48%" :class="getclassname('tdata',k)"> {{invoice.total}} </td>  
                <td width="48%" :class="getclassname('tdata',k)"> {{invoice.status}} </td>  
                <td width="48%" :class="getclassname('tdata',k)"> {{invoice.due_date}} </td>   
            </tr>
        </template>
        
      </tbody>
     
    </table>
    </div>
    <div class="col-md-12">
        <div class="result-cnt" :if="showResult"> {{startcount}} - {{currentitemcnt}} of {{resultCount}} </div>
        <button class="footer-btn First" @click="firstpage" > &lt;&lt; </button>
        <button class="footer-btn Previous"  @click="prevpage"> Previous </button>
        <button class="footer-btn Next"  @click="nextpage"> Next </button>
        <button class="footer-btn Last"  @click="lastpage"> &gt;&gt; </button>
        <div class="pageno"> Page {{ currentPage+1 }} </div>
        <!--<template v-for="(pageNumber,k) in totalPages" :key="k" >
           
            <a href="#" @click="setPage(pageNumber)" :if="Math.abs(k - currentPage) < 3 || k == totalPages - 1 || k == 0"  id="pagination"  :class="{current: currentPage === k, last: (k == totalPages - 1 && Math.abs(k - currentPage) > 3), first:(k == 0 && Math.abs(k - currentPage) > 3)}">{{ k +1 }}</a>
        </template>-->
    </div>
</template>

<script>
import http from "../../src/httpcall";  



export default {
  name: 'ListPage',
  data(){
    return {
        invoices: [],
        filteredinvoices :[],
        updated: 0,
        startcount:0,
        currentitemcnt: 0,
        currentPage: 0,
        itemsPerPage: 5,
        resultCount: 0,
        thlist: ['Invoice No','Customer Name','Total','Status','Due Date']
        }
  },
  computed: {
      totalPages: function() {
        console.log(" totalPagestotalPagestotalPages " ,  Math.ceil(this.resultCount / this.itemsPerPage))
        return Math.ceil(this.resultCount / this.itemsPerPage)
      },
      paginateItems () {
        console.log(" paginateItemspaginateItems " ,  this.updated);
        this.updated;
        return this.filteredItems();
      },
      showResult() {
        console.log(" showResultshowResult " ,  this.currentitemcnt);
        this.loadpagecontent();
        return this.currentitemcnt
      },
  },
  methods: {
      loadpagecontent(){
        this.startcount = parseInt(this.currentPage * this.itemsPerPage)+1;
        var cnt = this.startcount+4;
        if(parseInt(this.resultCount) > 0 && parseInt(this.resultCount) < parseInt(cnt)){
          this.currentitemcnt = this.resultCount;
        }else{
          this.currentitemcnt = this.itemsPerPage;
        }
        console.log(" currentitemcntcurrentitemcnt " ,  this.currentitemcnt);
      },
      firstpage(){
        console.log(" firstpagefirstpage " ,  this.currentPage);
        this.currentPage = 0;
        this.currentitemcnt++;
      },
      lastpage(){
        console.log(" lastpagelastpage " ,  this.currentPage);
        this.currentPage = Math.round(this.resultCount/this.itemsPerPage);
        this.currentitemcnt++;
      },
      prevpage(){
        console.log(" prevpageprevpageprevpage " ,  this.currentPage);
        if (parseInt(this.currentPage) != 0){
          this.currentPage = parseInt(this.currentPage)-1;
          this.currentitemcnt++;
        }
      },
      nextpage(){
          console.log(" nextpagenextpage " ,  this.currentPage);
          this.currentPage = parseInt(this.currentPage)+1;
      },
      getclassname(text, n){
        return text+n;
      },
      setPage: function(pageNumber) {
        this.currentPage = pageNumber
      },
      filteredItems(){
          if(this.invoices.length == 0){
              return this.invoices;
          }
          console.log('sddd', this.invoices);
          this.resultCount = this.invoices.length
          if (this.currentPage >= this.totalPages) {
          this.currentPage = this.totalPages - 1
          }
          var index = this.currentPage * this.itemsPerPage
          this.filteredinvoices = this.invoices.slice(index, index + this.itemsPerPage)
          console.log(this.filteredinvoices, index,this.itemsPerPage )
          return this.filteredinvoices
      },
      async getData() {
          try {
              await http.get("/invoices/")
              .then(response => { this.invoices = response.data;  
                                console.log(response.data);  
                              })  
              .catch(e => { console.log(e);  }); 
          } catch (error) {
              console.log(error);
          }
          //this.invoices = JSON.parser(this.invoices)
          console.log(`invoices222`, this.invoices);
          this.updated++;
      },
  },
  
  created() {
    this.getData();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../../src/assets/styles.css'
</style>



