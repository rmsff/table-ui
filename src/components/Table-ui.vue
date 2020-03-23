
<template>
  <v-container>
    <h1>Table UI</h1>
    <hr id="hr" />
    <v-layout row wrap align-center justify-start>
      <b>Group by: </b>
      <v-layout justify-start row wrap>
        <v-flex v-for="(item, index) in headersData" :key="item.text + index" shrink>
          <v-btn
            class="text-none pa-1 ml-1"
            :color="selected[0] !== item.value ? 'white' : 'primary'"
            small
            :elevation="0"
            align-self-start
            v-if="item.text !== ''"
            @click="sortBy(item)"
          >
            <span class="font-weight-light">{{ item.text }}</span>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-spacer></v-spacer>

      <v-layout justify-start>
        <v-menu>
          <template v-slot:activator="{ on }">
            <v-btn
              style="text-transform: none"
              small
              color="primary"
              v-on="on"
              :disabled="selectedCheckbox.length === 0"
            >
              Delete &zwnj;
              <span v-if="selectedCheckbox.length > 0">
                ({{ selectedCheckbox.length }})</span
              >
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  Are you sure you want to delete selected items?
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn>Cancel</v-btn>
              <v-btn color="primary" @click="handleRemoveSelected({ selectedCheckbox })"
                >Confirm</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-layout>
      <v-spacer></v-spacer>

      <v-flex id="lesectcolumnsid">
        <v-select
          v-model="selected"
          :items="headersWithoutLastItem"
          dense
          placeholder="0 columns selected"
          multiple
          hide-details
          :rounded="true"
          color="primary"
        >
          <template v-slot:prepend-item>
            <v-list-item ripple @click="selectAll">
              <v-list-item-action>
                <v-icon>{{ selectIcon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Select All</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template v-slot:selection="{ item, index }">
            <span v-if="index === 0">{{ selected.length }} columns selected </span>
          </template>
        </v-select>
      </v-flex>
    </v-layout>

    <v-data-table
      :headers="selectedObj"
      :items="desserts"
      show-select
      v-model="selectedCheckbox"
      item-key="id"
      hide-default-footer
      :elevation="0"
    >
      <template v-slot:item="props">
        <tr>
          <td>
            <v-checkbox
              v-model="selectedCheckbox"
              :value="props.item"
              primary
              hide-details
            ></v-checkbox>
          </td>
          <td
            v-for="(product, productIndex) in selected"
            :key="product + productIndex"
            :v-if="selected.includes('product')"
          >
            {{ props.item[product] }}
          </td>
          <td>
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-btn small color="primary" class="text-none hideButton" v-on="on">
                  delete
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>
                      Are you sure you want to delete
                      <b>{{ props.item.product }}</b
                      >?
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn>Cancel</v-btn>
                  <v-btn color="error" @click="handleRemoveSelected({ props })"
                    >Confirm</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-snackbar v-model="errorSnackbar" color="error" :timeout="3000">
      server is not responding
      <v-btn @click="errorSnackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
  props: {
    desserts: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    selectedCheckbox: [],
    errorSnackbar: false, // tag to show snackBar
    headersData: [
      {
        text: 'Dessert (100g serving)',
        align: 'left',
        value: 'product',
      },
      { text: 'Calories', value: 'calories' },
      { text: 'Fat (g)', value: 'fat' },
      { text: 'Carbs (g)', value: 'carbs' },
      { text: 'Protein (g)', value: 'protein' },
      { text: 'Iron (%)', value: 'iron' },
      { text: '', value: '', sortable: false },
    ], // default headers data with parameters
    selected: ['product', 'calories', 'fat', 'carbs', 'protein', 'iron'], // selected headers data (which is shown)
  }),
  computed: {
    ...mapState(['isErrorRemoved']),
    // isErrorRemoved - boolean from Vuex which sets to TRUE if deleting error
    selectedObj: function() {
      // make an arr from Objects from filtered headers arr
      return this.filterHeaders();
    },
    headersWithoutLastItem: function() {
      // headers without last item - '' (which contains delete button)
      return this.headersData.slice(0, this.headersData.length - 1);
    },
    selectIcon() {
      return this.selected.length < 6
        ? 'mdi-checkbox-blank-outline'
        : 'mdi-checkbox-marked';
    },
  },
  methods: {
    ...mapActions(['deleteProduct']),
    ...mapMutations(['setDeletingError']),
    filterHeaders: function() {
      // filter headers Arr of Objects the same as sorted Arr
      let selectedHeadersWithDeleteColumn = this.selected.concat(['']);
      let filteredArrofObj = [];
      for (let i = 0; i < selectedHeadersWithDeleteColumn.length; i++) {
        for (let j = 0; j < this.headersData.length; j++) {
          if (selectedHeadersWithDeleteColumn[i] === this.headersData[j].value) {
            filteredArrofObj.push(this.headersData[j]);
          }
        }
      }
      return filteredArrofObj;
    },
    selectAll() {
      // select all columns
      if (this.selected.length < this.headersWithoutLastItem.length) {
        let headerNamesArr = this.headersWithoutLastItem.map(function(item) {
          return item.value;
        });
        this.selected = headerNamesArr.slice();
      } else {
        this.selected = [];
      }
    },
    sortBy(item) {
      let index = this.selected.indexOf(item.value);
      if (index === -1) return;
      let deletedElem = this.selected.splice(index, 1);
      this.selected.unshift(deletedElem[0]);
    },
    handleSelectItem(newSelectedCheckboxSingle) {
      this.selectedCheckboxSingle = newSelectedCheckboxSingle;
    },
    handleRemoveSelected({ props, selectedCheckbox }) {
      const callback = () => {
        if (selectedCheckbox) this.selectedCheckbox = [];
        if (props) {
          this.selectedCheckbox = this.selectedCheckbox.filter(
            (item) => item.id !== props.item.id
          );
        }
      };
      this.deleteProduct({ payload: selectedCheckbox || props.item, callback });
    },
  },
  watch: {
    isErrorRemoved: function() {
      this.errorSnackbar = true;
    },
    errorSnackbar: function() {
      this.setDeletingError(false);
    },
  },
};
</script>

<style  lang="sass" scoped>
#lesectcolumnsid
  width: 115px
  height: 32px
  div.v-input
    border-radius: 2px
    border: 1px solid #D5DAE0
    font-size: 14px !important
    margin: 0

#hr
  border: none
  color: #EDEDED
  background-color: #EDEDED
  height: 1px

.v-input--selection-controls
  margin: 0 !important

.mytable .v-table tbody tr:not(:last-child)
  border-bottom: none !important

.hideButton
  visibility: hidden
  transition: 0s !important
  -webkit-transition: 0s !important

  & > *
    transition: 0s !important
    -webkit-transition: 0s !important

  tr:hover &
    visibility: visible

tr
  cursor: pointer
</style>
