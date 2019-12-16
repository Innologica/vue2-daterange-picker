import { expect } from 'chai'
import DateRangePicker from '@/components/DateRangePicker'
import moment from 'moment'
import {getDateUtil} from '../../src/components/util'
import { shallowMount, mount } from '@vue/test-utils'

// helper function that mounts and returns the rendered text
function getRenderedComponent (Component, propsData) {
  // const Ctor = Vue.extend(Component)
  // return new Ctor({propsData: propsData}).$mount()
  return shallowMount(Component, { propsData })
}

const propsData = {
  dateRange: {
    startDate: '2017-09-19',
    endDate: '2017-10-09'
  },
  showWeekNumbers: true,
}

describe('DateRangePicker.vue', () => {
  let wrapper = getRenderedComponent(DateRangePicker, propsData)
  const vm = wrapper.vm
  let dt_start = new Date(propsData.dateRange.startDate)
  let dt_end = new Date(propsData.dateRange.endDate)

  let dt_start_text = getDateUtil(vm.dateUtil).format(dt_start, vm.locale.format)
  let dt_end_text = getDateUtil(vm.dateUtil).format(dt_end, vm.locale.format)

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
    wrapper.setProps({
      dateRange: {
        startDate: '1981-11-24',
        endDate: '2018-10-09'
      }
    })

    vm.$nextTick(() => {
      // console.error(vm.start, vm.dateRange)
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
    wrapper.setProps({ dateRange: { startDate: null, endDate: null } })
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

describe('DateRangePicker.vue MIN/MAX', () => {
  const wrapper = mount(DateRangePicker, { propsData: {
      dateRange: {
        startDate: '2017-09-19',
        endDate: '2017-10-09'
      },
      minDate: '2016-09-02',
      maxDate: '2019-10-02',
      showDropdowns: true,
    }
  })
  const vm = wrapper.vm

  it('should not be able to navigate outside of min/max values', (done) => {
    //the input is missing when not open
    expect(vm.$el.querySelector('.yearselect')).to.equal(null)
    expect(vm.monthDate.getFullYear()).to.equal(2017)

    wrapper.setData({open: true})

    vm.$nextTick(() => {
      const input = wrapper.find('.yearselect')
      input.setValue(2016)

      vm.$nextTick(() => {
        expect(vm.monthDate.getFullYear()).to.equal(2016)
        done()
      })

    })
  })

  it('cannot select before min date', (done) => {
    const input = wrapper.find('.yearselect')

    input.setValue(2015)

    vm.$nextTick(() => {
      expect(vm.monthDate.getFullYear()).to.equal(2016)
      done()
    })
  })
})
