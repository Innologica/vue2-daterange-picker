<template>
    <div>
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="prop in props">
                <td nowrap class="text-sm" :class="{ required: prop.value.required }">{{prop.name}}</td>
                <td nowrap class="text-sm">{{prop.value | type}}</td>
                <td nowrap class="text-sm" v-html="$options.filters.default(prop)"></td>
                <td style="white-space: pre-wrap" v-html="prop.description"></td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  export default {
    name: "ComponentProps",
    props: {
      component: {
        type: String,
        required: true
      }
    },
    data () {
      let meta = require('../../docs')
      // console.log(meta[0].props[12])
      return {
        props: meta[0].props
      }
    },
    filters: {
      type (value) {
        if (typeof value === 'string') {
          return value
        } else if (typeof value === "object") {
          if (typeof value.type === 'string')
            return value.type
          if (typeof value.type === "object") {
            if (value.type.type === "ArrayExpression") {
              let type_str = value.type.elements.reduce((t, e) => t.concat(e.name), [])
              return type_str.join(', ')
            }
          }
        }
        return "undefined"
      },
      default (prop) {
        //check for default keyword
        let keyword = prop.keywords.find(x => x.name === "default")
        if (keyword) {
          try {
            if(keyword.description[0] === '{')
                return '<pre class="language-json">' + keyword.description + '</pre>'
          } catch (e) {
            console.log(e, keyword.description)
          }
          return keyword.description

        }

        if(prop.value.default === null)
          return "null"
        if (typeof prop.value.default !== "object")
          return prop.value.default

        console.log(prop)
      }
    }

  }
</script>

<style lang="scss" scoped>
    .required {
        color: red;

        &::after {
            content: '*';
        }
    }

    .text-sm {
        font-size: 15px;
    }
</style>
