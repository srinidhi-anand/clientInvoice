<template>
  <div class="about">
    <InvoiceCreate />
  </div>
</template>

<script>
import InvoiceCreate from '@/components/Invoices.vue'

export default {
  name: 'CreateView',
  components: {
    InvoiceCreate
  }
}
</script>

