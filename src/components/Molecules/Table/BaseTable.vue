<template>
  <div class="flex-column">
    <table>
      <caption>
        {{
          caption
        }}
      </caption>
      <thead>
        <tr>
          <th
            v-for="(column, index) of table.columns.baseColumns"
            :key="index"
            scope="col"
          >
            {{ column.title }}
          </th>
          <th v-if="table.columns.actionColumns.length > 0" scope="col">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) of table.data" :key="index">
          <td
            v-for="(column, index) of table.columns.baseColumns"
            :key="index"
            :data-label="column.title"
          >
            {{ row[column.property] }}
          </td>
          <td
            v-if="table.columns.actionColumns.length > 0"
            data-label="Actions"
            class="flex-row"
          >
            <span
              v-for="(action, index) of table.columns.actionColumns"
              :key="index"
            >
              <a
                @click="
                  actionHasBeenClicked(action.property, row[action.property])
                "
                ><i v-if="action.icon.length > 0" :class="action.icon" />{{
                  action.title
                }}</a
              >
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Table from '~/components/Molecules/Table/Table'

export default defineComponent({
  name: 'BaseTableVue',
  props: {
    table: {
      type: Object as () => Table,
      required: true,
    },
    caption: {
      type: String as () => string,
      required: true,
    },
  },
  methods: {
    actionHasBeenClicked(property: string, value: any) {
      this.$emit('actionHasBeenClicked', property, value)
    },
  },
})
</script>

<style scoped>
table {
  border-collapse: collapse;
  padding: 0;
  width: 90%;
  table-layout: fixed;
  margin: 25px 0;
  font-size: 0.9em;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

table caption {
  font-size: 1.5em;
  margin: 0.5em 0 0.75em;
}

table tbody tr {
  border-bottom: 1px solid #ddd;
}

table thead tr {
  background-color: #009879;
  color: #fff;
  text-align: left;
}

table th,
table td {
  padding: 12px 15px;
  text-align: center;
}

tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

table tbody tr td span {
  padding-left: 12px;
  padding-right: 12px;
}

table tbody tr td span a {
  text-decoration: none;
  color: black;
}

table tbody tr td span a:hover {
  cursor: pointer;
  color: var(--primary_text_hover);
}

table tbody tr td span i {
  padding-left: 6px;
  padding-right: 6px;
}
@media screen and (min-width: 1024px) {
  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }
}

@media screen and (max-width: 1024px) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }

  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: 0.625em;
  }

  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: 0.8em;
    text-align: right;
  }

  table td::before {
    /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  table td::before[data-label='Actions'] {
    color: red;
  }

  table td:last-child {
    border-bottom: 0;
  }
}
</style>
