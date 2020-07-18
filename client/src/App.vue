<template>
  <div id="app">
    <Navbar />
    <!-- <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>-->
    <div class="container">
      <Errors v-if="error" :msg="error" />
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Errors from "@/components/Errors";
import { mapGetters } from "vuex";

export default {
  components: {
    Navbar,
    Errors
  },
  computed: {
    ...mapGetters(["error"])
  }
};
</script>

<style>
</style>
