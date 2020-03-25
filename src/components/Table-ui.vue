
<template>
  <v-container>
    <h1>Table UI</h1>
    <hr id="hr" />
    <v-layout row wrap align-center justify-start class="control-panel">
      <v-layout justify-start row wrap>
        <div id="sorting-by-text"><b>Sorting by:</b></div>
        <v-flex v-for="(item, index) in headersData" :key="item.text + index" shrink>
          <v-btn
            class="text-none pa-1 ml-1 button_heigth32"
            :color="selected[0] !== item.value ? '#f2f2f2' : 'primary'"
            small
            :elevation="0"
            align-self-start
            v-if="item.text !== ''"
            @click="sortByColumns(item)"
          >
            <span class="font-weight-light">{{ item.text }}</span>
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout justify-start>
        <v-menu>
          <template v-slot:activator="{ on }">
            <v-btn
              class="button_heigth32"
              style="text-transform: none"
              small
              color="primary"
              v-on="on"
              :disabled="selectedCheckbox.length === 0"
              >Delete &zwnj;
              <span v-if="selectedCheckbox.length > 0">
                ({{ selectedCheckbox.length }})
              </span>
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
                >Confirm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-layout>

      <v-layout justify-start>
        <v-row class="ma-0 pa-0" align="center">
          <v-col class="ma-0 pa-0">
            <v-select
              class="ma-0 pa-0 pagination__selector"
              v-model="itemsPerPage"
              :items="itemsPerPageArray"
              item-text="title"
              item-value="value"
              :rounded="true"
              color="primary"
              hide-details
              dense
            />
          </v-col>

          <v-btn
            :disabled="page === 1"
            small
            :elevation="0"
            class="text-none pagination__button"
            @click="formerPage"
            ><v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <span class="pagination__text">
            {{ countRecordsPage.first }}-{{ countRecordsPage.last }} of
            {{ countRecordsPage.total }}
          </span>

          <v-btn
            :disabled="numberOfPages === page"
            small
            :elevation="0"
            class="text-none pagination__button"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </v-layout>

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
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page="page"
      :custom-sort="customSortRows"
      :elevation="0"
      v-model="selectedCheckbox"
      show-select
      item-key="id"
      hide-default-footer
    >
      <template v-slot:item="props">
        <tr
          :style="
            props.index % 2 === 1
              ? 'background-color: #F8F9FA'
              : 'background-color: #ffffff'
          "
        >
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
                <v-btn small text class="text-none hideButton" v-on="on" :elevation="0">
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
    items: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    page: 1,
    itemsPerPage: 10,
    itemsPerPageArray: [
      { title: '10 Per Page', value: 10 },
      { title: '15 Per Page', value: 15 },
      { title: '20 Per Page', value: 20 },
    ],
    selectedCheckbox: [],
    errorSnackbar: false,
    headersData: [
      {
        text: 'Product (100g serving)',
        align: 'left',
        value: 'product',
      },
      { text: 'Calories', value: 'calories' },
      { text: 'Fat (g)', value: 'fat' },
      { text: 'Carbs (g)', value: 'carbs' },
      { text: 'Protein (g)', value: 'protein' },
      { text: 'Iron (%)', value: 'iron' },
      { text: '', value: '', sortable: false },
    ],
    selected: ['product', 'calories', 'fat', 'carbs', 'protein', 'iron'],
  }),
  computed: {
    ...mapState(['isErrorRemoved']),
    selectedObj: function() {
      return this.filterHeaders();
    },
    headersWithoutLastItem: function() {
      return this.headersData.slice(0, this.headersData.length - 1);
    },
    selectIcon() {
      return this.selected.length < 6
        ? 'mdi-checkbox-blank-outlined'
        : 'mdi-checkbox-marked';
    },
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    countRecordsPage() {
      const { itemsPerPage, page, items } = this;
      const total = items.length;
      const tempFirst = itemsPerPage * page - itemsPerPage + 1;
      const first = tempFirst > total ? total : tempFirst;
      const tampLast = itemsPerPage * page;
      const last = total > tampLast ? tampLast : tampLast - (tampLast - total);
      return { first, last, total };
    },
  },
  methods: {
    ...mapActions(['deleteItems']),
    ...mapMutations(['setDeletingError']),
    filterHeaders: function() {
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
      if (this.selected.length < this.headersWithoutLastItem.length) {
        let headerNamesArr = this.headersWithoutLastItem.map(({ value }) => value);
        this.selected = headerNamesArr.slice();
      } else {
        this.selected = [];
      }
    },
    sortByColumns(item) {
      let index = this.selected.indexOf(item.value);
      if (index === -1) return;
      let deletedElem = this.selected.splice(index, 1);
      this.selected.unshift(deletedElem[0]);
    },
    customSortRows(items, index, isDesc) {
      items.sort((a, b) => {
        if (typeof a[index] === 'string') {
          return !isDesc[0]
            ? a[index].toLowerCase().localeCompare(b[index].toLowerCase())
            : b[index].toLowerCase().localeCompare(a[index].toLowerCase());
        }
        if (typeof a[index] === 'number') {
          return !isDesc[0] ? b[index] - a[index] : a[index] - b[index];
        }
      });
      this.selectedCheckbox = [];
      return items;
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
      this.deleteItems({ payload: selectedCheckbox || props.item, callback });
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
  },
  watch: {
    isErrorRemoved: function() {
      this.errorSnackbar = true;
    },
    errorSnackbar: function() {
      this.setDeletingError(false);
    },
    itemsPerPage() {
      const { page, numberOfPages } = this;
      if (page > numberOfPages) this.page = numberOfPages;
      this.selectedCheckbox = [];
    },
    page() {
      this.selectedCheckbox = [];
    },
    selected() {
      this.selectedCheckbox = [];
    },
    selectedCheckbox(value) {
      //if (toString.call(value) !== '[object Array]');
      console.log(toString.call(value));
    },
  },
};
</script>

<style  lang="sass" scoped>
#sorting-by-text
  display: flex
  align-items: center

#lesectcolumnsid
  div.v-input
    width: 200px
    height: 32px !important

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

// .mytable .v-table tbody tr:not(:last-child)
//   border-bottom: none !important
.pagination__button
  width: 32px !important
  height: 32px !important
  padding: 0 !important
  min-width: 1px !important
  background-color: #ffffff
  color: #5B5E77 !important
  border: 1px solid #D5DAE0 !important
  border-radius: 2px !important

.pagination__text
  font-weight: 600
  font-size: 14px
  line-height: 24px
  color: #3D374A
  margin: 0 8px 0 8px

.pagination__selector
  height: 32px
  font-size: 14px
  border: 1px solid #D5DAE0
  border-radius: 2px
  max-width: 170px

.button_heigth32
  height: 32px !important
  border-radius: 2px

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
