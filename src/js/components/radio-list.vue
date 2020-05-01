<template>
    <ul>
        <li v-for="(item, index) in count">
            <input type="radio"
                   class="mainForm__participantInputRadio"
                   :id='inputName + "_" + index'
                   :name='inputName'
                   :checked="index === 0"
                   :value='"item_" + index'
                   @change="$emit('input', $event.target.value)">
            <label :for='inputName + "_" + index'
                   class="mainForm__participantInputLabel">
                <slot :name="'item_' + index"></slot>
            </label>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "radio-list",
        props: [
            'finStepIndex',
            'participantIndex',
            'value',
            'name'
        ],
        data(){
          return {
              countDefault: 2
          }
        },
        computed: {
            inputName: function() {
              return this.name + "_" + this.finStepIndex + "_" + this.participantIndex
            },
            count: function() {
                return this.$attrs.count ? Number(this.$attrs.count) : this.countDefault
            }
        },
        created() {
            // debugger;
        }
    }
</script>