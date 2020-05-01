import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';
import {ru} from 'vuejs-datepicker/dist/locale';
import VueSlider from 'vue-slider-component';
import questionImage from './components/questionImage.vue';
// import fieldsetBlock from './components/fieldset-block.vue';

window.mainForm = new Vue({
    el: '#main-form',
    data: {
        lastStage: false,
        finSteps: [],
        ru,
        countList: [
                {
                    nominative: 'первый',
                    genitive: 'первого'
                },
                {
                    nominative: 'второй',
                    genitive: 'второго'
                },
                {
                    nominative: 'третий',
                    genitive: 'третьего'
                },
                {
                    nominative: 'четвертый',
                    genitive: 'четвертого'
                },
                {
                    nominative: 'пятый',
                    genitive: 'пятого'
                },
                {
                    nominative: 'шестой',
                    genitive: 'шестого'
                },
                {
                    nominative: 'седьмой',
                    genitive: 'седьмого'
                },
                {
                    nominative: 'восьмой',
                    genitive: 'восьмого'
                },
                {
                    nominative: 'девятый',
                    genitive: 'девятого'
                },
                {
                    nominative: 'десятый',
                    genitive: 'десятого'
                }
        ],
        participantsNames: [
            'Гужиков Павел',
            'Путин Владимир',
            'Шойгу Сергей',
            'Ардинцев Иван',
            'Медведев Дмитрий'
        ],
        isStepsSaved: false,
        lastStageProps: {
            allowUnexpectedFin: false,
            unexpectedFin: 'proportional',
            addOtherAgreements: false
        }
    },
    components: {
        Datepicker,
        VueSlider,
        questionImage,
        // fieldsetBlock
        fieldsetBlock: () => import (/* webpackMode: "eager" */ './components/fieldset-block.vue')
    },
    methods: {
        stepDefProps: function () {
            return {
                isSaved: false,
                checkedParticipants: [],
                participantsProps: this.participantsNames
                        .map(function () {
                                return {
                                    doneConditions: false,
                                    finConditions: [{}],
                                    orderEntry: 'once',
                                    tranches: [{}, {}],
                                    finForm: 'cashIn',
                                    loanType: 'noPurpose',
                                    convertPossible: true
                                }
                        }),
                isChangingAfter: false,
                ranges: [],
                lockFlags: []
            }
        },
        addStep: function () {
            this.finSteps.push(this.stepDefProps());
        },
        addItem: function (items) {
                items.push({});
        },
        debug: function (a,b,c) {
            debugger;
        },
        clearForm: function (step) {
            this.$set(this.finSteps, step, this.stepDefProps())
        },
        saveForm: function (step) {
            this.finSteps[step].isSaved = true;
            this.updateRanges(step);
        },
        updateRanges: function (stepIndex, rangeIndex) {
            let finStep = this.finSteps[stepIndex],
                ranges = finStep.ranges,
                lockFlags = finStep.lockFlags,
                freeFlagsQuantity = () => lockFlags.filter(item => !item).length;

            if (rangeIndex >= 0) {
                let rangesSum = () => ranges.reduce((sum, current) =>  Number(sum) + Number(current)),
                    rangesSumResult = rangesSum(),
                    overRangeValue = 0;
                lockFlags[rangeIndex] = true;


                if (rangesSumResult !== 100) {
                    lockFlags.forEach(function (item, index) {
                        if (!item) {
                            ranges[index] -= (rangesSumResult - 100) / freeFlagsQuantity();
                            if (ranges[index] < 0) {
                                overRangeValue += ranges[index];
                            }
                        }
                    });
                    if (overRangeValue !== 0) {
                        ranges.forEach(function (item, index) {
                            if (item < 0) {
                                lockFlags[index] = true;
                            }
                        });
                        lockFlags.forEach(function (item, index) {
                            if (!item) {
                                ranges[index] += overRangeValue / freeFlagsQuantity();
                            }
                        });
                        ranges.forEach(function (item, index) {
                            if (item < 0) {
                                lockFlags[index] = false;
                                ranges[index] = 0;
                            }
                        });
                    }
                    if(rangesSum() !== 100) {
                        ranges[rangeIndex] -= (rangesSum() - 100);
                        this.$refs['sliders_' + stepIndex][rangeIndex].setValue(ranges[rangeIndex]);
                    }
                }
                lockFlags[rangeIndex] = false;
            }
            else {
                finStep.lockFlags = [];
                finStep.checkedParticipants.forEach(function (item, index) {
                    mainForm.$set(ranges, index, 100 / finStep.checkedParticipants.length);
                    finStep.lockFlags = finStep.lockFlags.concat(false);
                });
            }
            finStep.ranges = ranges.map(function (item) {
                return Math.round(item)
            });
        },
        updateStepsSaved: function () {
            this.isStepsSaved = this.finSteps.every(function (item) {
                                        return item.isSaved
                                    })
        },
        placeholderCounts: function (index, type) {
            if (index > 9){
                return ''
            }
            else {
                return ' ' + this.countList[index][type]
            }
        },
        saveStage: function () {
            sessionStorage.data = JSON.stringify(this.$data, function (key, value) {
                // debugger;
                return (key == 'ru' || key == 'countList') ? undefined : value;
            });
        }
    },
    created: function () {
        this.addStep();

        if (sessionStorage.data){
            let parsed = JSON.parse(sessionStorage.data);

            for (let item in parsed) {
                this[item] = parsed[item]
            }
        }
    }
});
