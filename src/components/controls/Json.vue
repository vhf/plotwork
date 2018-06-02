<template>
  <span class="json">
    <label v-show="label">
      {{ label }}
    </label>
    <textarea
      :value="str(value)"
      :cols="cols"
      class="textarea"
      rows="9"
      @input="input"/>
  </span>
</template>

<script>
import stringify from 'json-stringify-pretty-compact'
import _debounce from 'lodash/debounce'

export default {
  name: 'Json',
  props: {
    label: {
      type: String,
      default () {
        return ''
      }
    },
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      saved: '',
      cols: 40,
      foo: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.val = this.str(this.value)
      this.saved = this.val
    }, 100)
  },
  methods: {
    str (o) {
      return stringify(o, {maxLength: this.cols})
    },
    input ($event) {
      this.change($event)
    },
    change: _debounce(function ($event) {
      let newVal = this.val
      try {
        JSON.parse($event.target.value)
        newVal = $event.target.value
      } catch (e) {}

      this.val = this.str(JSON.parse(newVal))
      this.$emit('input', JSON.parse(this.val))
      this.foo = false
    }, 250)
  }
}
</script>

<style scoped>
textarea {
  font-family: monospace;
  font-size: 14px;
  color: #fff;
}
@media (max-width: 767px) {
  .json {
    display: none;
  }
}
</style>
