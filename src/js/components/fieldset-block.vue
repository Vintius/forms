<template>
    <div class="mainForm__participantFieldset">
        <div class="mainForm__participantFieldsetTitle">
            <slot name="title"></slot>
        </div>
        <div class="mainForm__participantInputs">
            <component :is="componentType" v-bind="$attrs"
                        v-on="$listeners">
                <template v-for="(slot, name) in $slots" #[name]>
                    <slot :name="name"></slot>
                </template>
            </component>
        </div>
    </div>
</template>

<script>
    export default {
        name: "fieldset-block",
        components: {
            radioList: () => import (/* webpackMode: "eager" */ './radio-list.vue')
        },
        props: [
            'type'
        ],
        computed: {
            componentType: function() {
                switch (this.type) {
                    case 'radio':
                        return 'radio-list';
                        break;
                }
            }
        },
        created() {
            // debugger;
        }
    }
</script>