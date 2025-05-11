<!-- components/SectionGrid.vue -->
<template>
    <div class="mb-10">
      <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SearchCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          :type="type"
          @click="handleClick(item)"
        />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      items: Array,
      type: String
    },
    methods: {
      handleClick(item) {
        this.$emit('select', item);
      }
    }
  };
  </script>