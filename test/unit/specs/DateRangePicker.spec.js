import Vue from 'vue'
import DateRangePicker from '@/components/DateRangePicker'
import moment from 'moment'

// helper function that mounts and returns the rendered text
function getRenderedComponent (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({propsData: propsData}).$mount()
  return vm
}

const propsData = {
  dateRange: {
    startDate: '2017-09-19',
    endDate: '2017-10-09'
  }
}

describe('DateRangePicker.vue', () => {
  let vm = getRenderedComponent(DateRangePicker, propsData)
  let dt_start = new Date(propsData.dateRange.startDate)
  let dt_end = new Date(propsData.dateRange.endDate)

  let dt_start_text = moment(dt_start).format(vm.locale.format)
  let dt_end_text = moment(dt_end).format(vm.locale.format)

  it('should render correct contents', () => {
    expect(vm.$el.querySelector('.reportrange-text span').textContent)
      .to.equal(dt_start_text + vm.locale.separator + dt_end_text)
  })

  it('should be hidden', () => {
    expect(vm.$el.querySelector('.daterangepicker'))
      .to.equal(null)
  })

  it('should open when clicked', (done) => {
    vm.open = true

    vm.$nextTick(() => {
      expect(vm.$el.querySelector('.daterangepicker'))
        .to.not.be.empty
      done()
    })
  })

  it('should select the dates passed by props "1981-11-24" - "2018-10-09"', (done) => {
    vm.dateRange.startDate = '1981-11-24'
    vm.dateRange.endDate = '2018-10-09'

    vm.$nextTick(() => {

      expect(moment(vm.start).isSame('1981-11-24', 'date')).to.equal(true)
      expect(moment(vm.end).isSame('2018-10-09', 'date')).to.equal(true)

      done()
    })
  })

  //bugs
  it('getMonth is not a function #40 - select month before the start date', () => {
    vm.startDate = propsData.startDate
    vm.endDate = propsData.endDate
    vm.changeRightMonth({month: 1, year: 2017})
    expect(moment(vm.nextMonthDate).month()).to.equal(1)
    expect(moment(vm.nextMonthDate).year()).to.equal(2017)
  })

  it('Cleared state / null value? #41 - should be able to set null value', (done) => {
    vm.dateRange.startDate = null
    vm.$nextTick(() => {
      expect(vm.start).to.equal(null)
      expect(vm.end).to.equal(null)

      expect(vm.startText).to.equal("")
      expect(vm.endText).to.equal("")
      expect(vm.rangeText).to.equal(vm.locale.separator)
      done()
    })
  })
})
