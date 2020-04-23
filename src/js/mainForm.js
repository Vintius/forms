import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';
import {ru} from 'vuejs-datepicker/dist/locale';
import VueSlider from 'vue-slider-component';

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
        questionImage: {
            template: '<svg class="planning__tipImage" width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg">\
                            <g stroke="none" stroke-width="1">\
                                <g transform="translate(-620.000000, -236.000000)">\
                                    <g transform="translate(620.000000, 236.000000)">\
                                        <circle stroke="#4174D7" cx="8.5" cy="8.5" r="8"></circle>\
                                        <path d="M8.195313,5.0028176 C6.984375,5.0692246 6,6.0848496 6,7.3192246 L7,7.3192246 C7,6.5067246 7.703125,5.8739116 8.558594,6.0223496 C9.175781,6.1278176 9.65625,6.7293806 9.640625,7.3582866 C9.621094,7.9168806 9.300781,8.2684426 8.820313,8.4754746 C8.527344,8.6082866 8.246094,8.7332866 8.007813,8.9832866 C7.769531,9.2332866 7.640625,9.6043806 7.640625,9.9989116 L8.640625,9.9989116 C8.640625,9.7762556 8.667969,9.7410996 8.730469,9.6746926 C8.792969,9.6082866 8.953125,9.5145366 9.226563,9.3934426 C9.972656,9.0653176 10.609375,8.3543806 10.640625,7.3895366 C10.671875,6.2528176 9.859375,5.2293806 8.726563,5.0340676 C8.546875,5.0028176 8.371094,4.9950056 8.195313,5.0028176 Z M7.640625,10.9989116 L7.640625,11.9989116 L8.640625,11.9989116 L8.640625,10.9989116 L7.640625,10.9989116 Z" id="Shape" fill-rule="nonzero"></path>\
                                    </g>\
                                </g>\
                            </g>\
                        </svg>'
        }
    },
    computed: {

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
        }
    },
    created: function () {
        this.addStep();
    }
});