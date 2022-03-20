<template>
  <div class="about">
     <!--<div>User {{ $route.params.id }}</div>-->
    <InvoiceUpdate /> 
  </div>
</template>

<script>
import InvoiceUpdate from '@/components/InvoiceUpdate.vue'

export default {
  name: 'UpdateView',
  components: {
    InvoiceUpdate
  }
}
</script>

