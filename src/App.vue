<template>
  <div id="app">
    <div class="content" @click="next">
      <transition name="fade-text" mode="out-in">
        <div v-fit-text :class="{both: response.text && response.image}" v-html="response.text" :key="responseIndex"></div>
      </transition>
      <transition name="fade-img" mode="out-in">
        <img v-if="response.image" :class="{both: !!response.text}" :src="response.image" :key="responseIndex">
      </transition>
    </div>
    <footer>🌯 no idea, read code 🌯</footer>
  </div>
</template>

<script>
import clamp from 'lodash/clamp';
import flattenDeep from 'lodash/flattenDeep';
import shuffle from 'lodash/shuffle';
import Vue from 'vue';

import FitText from './vue-fit-text';
import RESPONSES from './responses.json';

Vue.use(FitText);

export default {
  name: 'app',

  computed: {
    response() {
      return this.responses[this.responseIndex];
    },

    responses() {
      return shuffle(flattenDeep(Object.values(RESPONSES)));
    },
  },

  data() {
    return {
      responseIndex: 0,
      responseTimeout: null,
    };
  },

  methods: {
    next({increment=true}={}) {
      if (increment) this.responseIndex++;
      if (this.responseIndex >= this.responses.length) this.responseIndex = 0;
      let duration = this.response.duration || 5000;
      if (this.response.text) {
        duration = clamp(this.response.text.length * 100, 5000, 15000);
      }
      clearTimeout(this.responseTimeout);
      this.responseTimeout = setTimeout(this.next, duration);
    },
  },

  mounted() {
    this.next({increment: false});
    this.responses.filter(r => r.image).forEach(r => {
      const img = new Image();
      img.src = r.image;
    });
  },

  destroyed() {
    clearTimeout(this.responseTimeout);
  }
}
</script>

<style lang="stylus">
font-smoothing()
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

@font-face
  font-family Apercu Pro
  font-style normal
  font-weight normal
  src:
    url('/fonts/apercu-bold-pro.woff2') format('woff2'),
    url('/fonts/apercu-bold-pro.woff') format('woff')

*
  box-sizing border-box

body
  background-color #4284fb
  color #fff
  font-family Apercu Pro, serif, sans-serif
  font-smoothing()
  margin 0
  padding 0

#app
  display grid
  grid-template-areas:
    "content" \
    "footer"
  grid-template-rows 1fr auto
  height 100vh
  padding 5vh

.content
  align-items center
  display flex
  flex-direction column
  grid-area content
  justify-content center
  line-height 1.1
  overflow hidden
  > div
    max-width 30em
    margin-bottom 30px
    &.both
      padding-bottom 20vh
  > img
    max-height 30vh
    position absolute
    &.both
      bottom 20vh

footer
  grid-area footer
  text-align right

.fade-text-enter
  opacity 0
  transform translateY(-3vh)
.fade-text-enter-active
  transition all 300ms ease-out

.fade-text-leave-to
  opacity 0
.fade-text-leave-active
  transition all 300ms ease-in

.fade-img-enter
  opacity 0
  transform translateY(3vh)
.fade-img-enter-active
  transition all 300ms ease-out

.fade-img-leave-to
  opacity 0
.fade-img-leave-active
  transition all 300ms ease-in
</style>
