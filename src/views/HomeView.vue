<template>
  <div class="home">
    <ListPage />
  </div>
</template>

<script>
import ListPage from '@/components/InvoiceList.vue'

export default {
  name: 'HomeView',
  components: {
    ListPage
  }
}
</script>
