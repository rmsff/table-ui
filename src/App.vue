<template>
  <v-app>
    <v-content>
      <div v-if="isLoadingError">
        <v-alert :value="true" color="error" icon="warning" outline>
          Data loading failed. You can try one more time:
          <v-btn small outline color="info" @click="getData()">
            Try
          </v-btn>
        </v-alert>
      </div>
      <div v-else>
        <TableUi v-if="isLoading" :items="items" />
        <div class="text-center" v-else>
          <v-progress-circular
            :size="100"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <h2 color="primary">loading data...</h2>
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import TableUi from './components/Table-ui';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'App',
  components: {
    TableUi,
  },
  data: () => ({}),
  computed: {
    ...mapState(['isLoading', 'isLoadingError', 'items']),
  },
  methods: {
    ...mapActions(['getData']),
  },
  mounted: function() {
    this.getData();
  },
};
</script>

<style>
#app {
  background-color: #f2f2f2;
}
.v-progress-circular {
  margin-top: 10%;
}
</style>
