<template>
  <div :class="$style.container">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'AppContainer'
}
</script>

<style lang="scss" module>
.container {
  margin: 0 auto;
  max-width: 90%;
  @include xs-plus {
    max-width: 600px;
  }
  @include sm-plus {
    max-width: 768px;
    //padding: 0 20px;
  }
  @include md-plus {
    max-width: 1005px;
  }
  @include xl-plus {
    max-width: 1228px;
  }
}
</style>
