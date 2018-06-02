<template>
  <div class="checkbox">
    <input
      :id="label"
      :checked="value"
      type="checkbox"
      @change="change">
    <label
      v-show="label"
      :for="label">
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'Bool',
  props: {
    invert: {
      type: Boolean,
      default () {
        return false
      }
    },
    label: {
      type: String,
      default () {
        return ''
      }
    },
    checked: {
      type: Boolean,
      default () {
        return true
      }
    },
    value: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  methods: {
    change ($event) {
      this.$emit('input', $event.target.checked)
      this.$emit('change', $event.target.checked)
    }
  }
}
</script>

<style scoped>
</style>
