<!--
<template>
	<div>
        <vfd></vfd>
    </div>
</template>
-->

// <script>
//     import vfd from 'vfd'
    
//     export default {
//         name: "vfdcode",
//         components: {
//             vfd
//         }
//     }
// </script>


<template>
  <easyflow>
  </easyflow>
</template>

<script>
    import easyflow from '@/components/ef/panel.vue';
    
    export default {
        name: "easyflowcode",
        components: {
            easyflow
        }
    }
</script>