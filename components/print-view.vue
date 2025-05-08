<script setup lang="ts">
import "@/styles/print.css";

const printRef = ref(null);
defineExpose({ printRef }); // expose to parent if needed
</script>

<template>
	<!-- This wrapper is important -->
	<div ref="printRef">
		<div id="print-slot" />
	</div>
</template>
